import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    getProducts,
    getTerminals,
    createOrder,
    addProductToOrder,
    getOrders,
    updateOrderStatus,
} from './api'
import TerminalView from './TerminalView'
import KitchenView from './KitchenView'
import PickupView from './PickupView'
import './App.css'

function App() {
  const location = useLocation()
  const currentView = location.pathname.slice(1) || 'terminal'
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [orderMessage, setOrderMessage] = useState('')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [terminals, setTerminals] = useState([])
  const [selectedTerminalId, setSelectedTerminalId] = useState('')
  const [terminalsLoading, setTerminalsLoading] = useState(true)
  const [terminalsError, setTerminalsError] = useState('')

  const loadOrders = useCallback(async (statuses) => {
    setOrdersLoading(true)

    try {
      const results = await Promise.all(
          statuses.map((status) => getOrders(status))
      )

      setOrders(results.flat())
      setOrdersError('')
    } catch (err) {
      console.error(err)
      setOrdersError(
          err.message || 'No se pudieron cargar los pedidos.'
      )
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchOrders() {
      const statuses =
          currentView === 'cocina'
              ? ['PENDING', 'IN_PREPARATION']
              : currentView === 'recogida'
                  ? ['COMPLETED']
                  : []

      if (statuses.length === 0) {
        setOrdersLoading(false)
        return
      }

      setOrdersLoading(true)

      try {
        const results = await Promise.all(
            statuses.map((status) => getOrders(status))
        )

        if (!cancelled) {
          setOrders(results.flat())
          setOrdersError('')
        }
      } catch (err) {
        console.error(err)

        if (!cancelled) {
          setOrdersError(
              err.message || 'No se pudieron cargar los pedidos.'
          )
        }
      } finally {
        if (!cancelled) {
          setOrdersLoading(false)
        }
      }
    }

    fetchOrders()

    return () => {
      cancelled = true
    }
  }, [currentView])

  async function handleStatusChange(orderId, status) {
    if (updatingOrderId !== null) {
      return
    }

    try {
      setUpdatingOrderId(orderId)
      setOrdersError('')

      await updateOrderStatus(orderId, status)

      if (currentView === 'cocina') {
        await loadOrders(['PENDING', 'IN_PREPARATION'])
      } else if (currentView === 'recogida') {
        await loadOrders(['COMPLETED'])
      }
    } catch (err) {
      console.error(err)
      setOrdersError(
          err.message || 'No se pudo actualizar el estado del pedido.'
      )
    } finally {
      setUpdatingOrderId(null)
    }
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const data = await getProducts()
        setProducts(data)
        setError('')
      } catch (err) {
        console.error(err);
        setError(err.message || 'No se pudieron cargar los productos.');
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    async function loadTerminals() {
      try {
        setTerminalsLoading(true)
        setTerminalsError('')

        const data = await getTerminals()
        setTerminals(data)

        if (data.length > 0) {
          setSelectedTerminalId(String(data[0].id))
        }
      } catch (err) {
        console.error(err)
        setTerminalsError(
            err.message || 'No se pudieron cargar los terminales.'
        )
      } finally {
        setTerminalsLoading(false)
      }
    }

    loadTerminals()
  }, [])



  function addProduct(product) {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
          (item) => item.id === product.id
      )

      if (existingProduct) {
        return currentCart.map((item) =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })
  }


  function removeProduct(id) {
    setCart((currentCart) =>
        currentCart
            .map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter((item) => item.quantity > 0)
    )
  }

  function removeProductCompletely(productId) {
    setCart((currentCart) =>
        currentCart.filter((item) => item.id !== productId)
    )
  }

  function clearCart() {
    setCart([])
    setOrderMessage('')
  }

  async function submitOrder() {
    if (
        cart.length === 0 ||
        submitting ||
        terminalsLoading ||
        terminalsError ||
        !selectedTerminalId
    ) {
      return
    }

    try {
      setSubmitting(true)
      setOrderMessage('')

      const order = await createOrder(total, Number(selectedTerminalId))

      for (const item of cart) {
        await addProductToOrder(
            order.id,
            item.id,
            item.quantity
        )
      }

      setCart([])
      setOrderMessage(`Pedido ${order.code} creado correctamente.`)
    } catch (err) {
      console.error(err);
      setOrderMessage(err.message || 'No se pudo completar el pedido.');
    } finally {
      setSubmitting(false)
    }
  }



  const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
  )


  return (
      <main>
        <header>
          <h1>Gestión de pedidos</h1>
          <p>Sistema de gestión del restaurante</p>
        </header>

        <nav aria-label="Vistas de la aplicación">
          <Link to="/terminal">Terminal</Link>
          <Link to="/cocina">Cocina</Link>
          <Link to="/recogida">Recogida</Link>
        </nav>

        {currentView === 'terminal' && (
            <TerminalView
                products={products}
                loading={loading}
                error={error}
                cart={cart}
                addProduct={addProduct}
                removeProduct={removeProduct}
                total={total}
                submitOrder={submitOrder}
                submitting={submitting}
                orderMessage={orderMessage}
                terminals={terminals}
                selectedTerminalId={selectedTerminalId}
                setSelectedTerminalId={setSelectedTerminalId}
                terminalsLoading={terminalsLoading}
                terminalsError={terminalsError}
                removeProductCompletely={removeProductCompletely}
                clearCart={clearCart}
            />
        )}

          {currentView === 'cocina' && (
              <KitchenView
                  orders={orders}
                  ordersLoading={ordersLoading}
                  ordersError={ordersError}
                  handleStatusChange={handleStatusChange}
                  updatingOrderId={updatingOrderId}
              />
          )}


          {currentView === 'recogida' && (
              <PickupView
                  orders={orders}
                  ordersLoading={ordersLoading}
                  ordersError={ordersError}
                  handleStatusChange={handleStatusChange}
                  updatingOrderId={updatingOrderId}
              />
          )}

      </main>
  )
}

export default App

