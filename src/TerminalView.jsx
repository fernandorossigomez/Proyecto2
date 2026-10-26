
function TerminalView({
                          products,
                          loading,
                          error,
                          cart,
                          addProduct,
                          removeProduct,
                          total,
                          submitOrder,
                          submitting,
                          orderMessage,
                      }) {
    return (
        <section>
            <h2>Terminal de pedidos</h2>

            <h3>Carta</h3>


            {loading ? (
                <p>Cargando productos...</p>
            ) : error ? (
                <p role="alert">{error}</p>
            ) : products.length === 0 ? (
                <p>No hay productos disponibles en este momento.</p>
            ) : (
                products.map((product) => (
                    <article key={product.id}>
            <span>
                {product.name} — {Number(product.price).toFixed(2)} €
            </span>
                        <button
                            type="button"
                            onClick={() => addProduct(product)}
                        >
                            Añadir
                        </button>
                    </article>
                ))
            )}

            <h3>Pedido actual</h3>

            {cart.length === 0 ? (
                <p>Aún no has añadido productos.</p>
            ) : (
                cart.map((item) => (
                    <article key={item.id}>
            <span>
              {item.name} × {item.quantity}
                {' — '}
                {(item.price * item.quantity).toFixed(2)} €
            </span>
                        <button
                            type="button"
                            onClick={() => removeProduct(item.id)}
                        >
                            Quitar uno
                        </button>
                    </article>
                ))
            )}

            <h3>Total: {total.toFixed(2)} €</h3>

            <button
                type="button"
                onClick={submitOrder}
                disabled={cart.length === 0 || submitting}
            >
                {submitting ? 'Enviando pedido...' : 'Confirmar pedido'}
            </button>

            {orderMessage && <p role="status">{orderMessage}</p>}
        </section>
    )
}

export default TerminalView
