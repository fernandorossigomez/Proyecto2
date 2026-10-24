import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

const productos = [
  { id: 1, nombre: 'Hamburguesa', precio: 8.5 },
  { id: 2, nombre: 'Patatas fritas', precio: 3 },
  { id: 3, nombre: 'Refresco', precio: 2.5 },
  { id: 4, nombre: 'Pizza', precio: 10 }
]

function App() {
  const [vista, setVista] = useState('terminal')
  const [carrito, setCarrito] = useState([])

  function anadirProducto(producto) {
    setCarrito((carritoActual) => {
      const productoExistente = carritoActual.find(
          (item) => item.id === producto.id
      )

      if (productoExistente) {
        return carritoActual.map((item) =>
            item.id === producto.id
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
        )
      }

      return [...carritoActual, { ...producto, cantidad: 1 }]
    })
  }

  function quitarProducto(id) {
    setCarrito((carritoActual) =>
        carritoActual
            .map((item) =>
                item.id === id
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            )
            .filter((item) => item.cantidad > 0)
    )
  }

  const total = carrito.reduce(
      (suma, item) => suma + item.precio * item.cantidad,
      0
  )

  return (
      <main>
        <header>
          <h1>Gestión de pedidos</h1>
          <p>Sistema de gestión del restaurante</p>
        </header>

        <nav aria-label="Vistas de la aplicación">
          <button type="button" onClick={() => setVista('terminal')}>
            Terminal
          </button>
          <button type="button" onClick={() => setVista('cocina')}>
            Cocina
          </button>
          <button type="button" onClick={() => setVista('recogida')}>
            Recogida
          </button>
        </nav>

        {vista === 'terminal' && (
            <section>
              <h2>Terminal de pedidos</h2>

              <h3>Carta</h3>

              {productos.map((producto) => (
                  <article key={producto.id}>
              <span>
                {producto.nombre} — {producto.precio.toFixed(2)} €
              </span>
                    <button
                        type="button"
                        onClick={() => anadirProducto(producto)}
                    >
                      Añadir
                    </button>
                  </article>
              ))}

              <h3>Pedido actual</h3>

              {carrito.length === 0 ? (
                  <p>Aún no has añadido productos.</p>
              ) : (
                  carrito.map((item) => (
                      <article key={item.id}>
                <span>
                  {item.nombre} × {item.cantidad}
                  {' — '}
                  {(item.precio * item.cantidad).toFixed(2)} €
                </span>
                        <button
                            type="button"
                            onClick={() => quitarProducto(item.id)}
                        >
                          Quitar uno
                        </button>
                      </article>
                  ))
              )}

              <h3>Total: {total.toFixed(2)} €</h3>
            </section>
        )}

        {vista === 'cocina' && (
            <section>
              <h2>Vista de Cocina</h2>
              <p>Aquí mostraremos los pedidos pendientes de preparación.</p>
            </section>
        )}

        {vista === 'recogida' && (
            <section>
              <h2>Vista de Recogida</h2>
              <p>Aquí mostraremos los pedidos listos para recoger.</p>
            </section>
        )}
      </main>
  )
}

export default App
