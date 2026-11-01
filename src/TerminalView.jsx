
function TerminalView({
                          products,
                          loading,
                          error,
                          terminals,
                          selectedTerminalId,
                          setSelectedTerminalId,
                          terminalsLoading,
                          terminalsError,
                          cart,
                          addProduct,
                          removeProduct,
                          removeProductCompletely,
                          total,
                          submitOrder,
                          submitting,
                          orderMessage,
                          clearCart,
                      }) {
    return (
        <section className="terminal-layout">
            <div className="menu-panel">

                <div className="section-heading">
                    <span className="section-eyebrow">RESTAURANTE</span>
                    <h2>Nuestra carta</h2>
                    <p>Elige los productos para preparar el pedido.</p>
                </div>

                <div className="terminal-selector">
                    <label htmlFor="terminal-select">Terminal de pedido</label>

                    {terminalsLoading ? (
                        <p>Cargando terminales...</p>
                    ) : terminalsError ? (
                        <p role="alert">{terminalsError}</p>
                    ) : terminals.length === 0 ? (
                        <p role="alert">No hay terminales disponibles.</p>
                    ) : (
                        <select
                            id="terminal-select"
                            value={selectedTerminalId}
                            onChange={(event) => setSelectedTerminalId(event.target.value)}
                        >
                            {terminals.map((terminal) => (
                                <option key={terminal.id} value={terminal.id}>
                                    {terminal.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                {loading ? (
                    <p className="empty-state">Cargando productos...</p>
                ) : error ? (
                    <p role="alert">{error}</p>
                ) : products.length === 0 ? (
                    <p className="empty-state">
                        No hay productos disponibles en este momento.
                    </p>
                ) : (
                    <div className="product-list">
                        {products.map((product) => (
                            <article className="product-card" key={product.id}>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="product-price">
                                        {Number(product.price).toFixed(2)} €
                                    </p>
                                </div>

                                <button
                                    className="add-button"
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => addProduct(product)}
                                    aria-label={`Añadir ${product.name} al pedido`}
                                >
                                    <span aria-hidden="true">+</span>
                                    Añadir
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <aside className="cart-panel">
                <div className="section-heading">
                    <span className="section-eyebrow">TU SELECCIÓN</span>
                    <h2>Pedido actual</h2>
                    <p>
                        {cart.reduce((sum, item) => sum + item.quantity, 0)} unidades
                        seleccionadas
                    </p>
                </div>

                {cart.length === 0 ? (
                    <div className="empty-cart">
            <span className="empty-cart-icon" aria-hidden="true">
              +
            </span>
                        <h3>Tu pedido está vacío</h3>
                        <p>Añade productos de la carta para empezar.</p>
                    </div>
                ) : (
                    <div className="cart-items">
                        {cart.map((item) => (
                            <article className="cart-item" key={item.id}>
                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <p>
                                        {item.quantity} × {Number(item.price).toFixed(2)} €
                                    </p>
                                </div>

                                <div className="cart-item-actions">
                                    <strong>
                                        {(item.price * item.quantity).toFixed(2)} €
                                    </strong>
                                    <button
                                        className="remove-button"
                                        type="button"
                                        disabled={submitting}
                                        onClick={() => removeProduct(item.id)}
                                        aria-label={`Quitar una unidad de ${item.name}`}
                                        title="Quitar una unidad"
                                    >
                                        −1
                                    </button>
                                    <button
                                        className="remove-button"
                                        type="button"
                                        disabled={submitting}
                                        onClick={() => removeProductCompletely(item.id)}
                                        aria-label={`Eliminar todas las unidades de ${item.name}`}
                                        title="Eliminar producto"
                                    >
                                        <span aria-hidden="true">🗑️</span>
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {cart.length > 0 && (
                    <button
                        className="clear-cart-button"
                        type="button"
                        disabled={submitting}
                        onClick={() => {
                            const confirmed = window.confirm(
                                '¿Seguro que quieres vaciar todo el carrito?'
                            )

                            if (confirmed) {
                                clearCart()
                            }
                        }}
                    >
                        Vaciar carrito
                    </button>
                )}

                <div className="cart-summary">
                    <div className="total-row">
                        <span>Total del pedido</span>
                        <strong>{total.toFixed(2)} €</strong>
                    </div>

                    <button
                        className="confirm-button"
                        type="button"
                        onClick={submitOrder}
                        disabled={
                            cart.length === 0 ||
                            submitting ||
                            terminalsLoading ||
                            Boolean(terminalsError) ||
                            !selectedTerminalId
                        }
                    >
                        {submitting ? "Enviando pedido..." : "Confirmar pedido"}
                    </button>

                    {orderMessage && (
                        <p role="status" className="order-message">
                            {orderMessage}
                        </p>
                    )}
                </div>
            </aside>
        </section>
    )
}

export default TerminalView
