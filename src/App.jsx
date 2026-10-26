import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    getProducts,
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

  const loadOrders = useCallback(async (statuses) => {
    try {
      setOrdersLoading(true)
      setOrdersError('')

      const results = await Promise.all(
          statuses.map((status) => getOrders(status))
      )

      setOrders(results.flat())
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
    if (currentView === 'cocina') {
      loadOrders(['PENDING', 'IN_PREPARATION'])
    } else if (currentView === 'recogida') {
      loadOrders(['COMPLETED'])
    }
  }, [currentView, loadOrders])

  async function handleStatusChange(orderId, status) {
    try {
      setOrdersError('')

      await updateOrderStatus(orderId, status)

      if (currentView === 'cocina') {
        await loadOrders(['PENDING', 'IN_PREPARATION'])
      } else if (currentView === 'recogida') {
        await loadOrders(['COMPLETED'])
      }
    } catch (err) {
      console.error(err);
      setOrdersError(err.message || 'No se pudo actualizar el estado del pedido.');
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

  async function submitOrder() {
    if (cart.length === 0 || submitting) {
      return
    }

    try {
      setSubmitting(true)
      setOrderMessage('')

      const order = await createOrder(total, 1)

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
            />
        )}

          {currentView === 'cocina' && (
              <KitchenView
                  orders={orders}
                  ordersLoading={ordersLoading}
                  ordersError={ordersError}
                  handleStatusChange={handleStatusChange}
              />
          )}


          {currentView === 'recogida' && (
              <PickupView
                  orders={orders}
                  ordersLoading={ordersLoading}
                  ordersError={ordersError}
              />
          )}

      </main>
  )
}

export default App

