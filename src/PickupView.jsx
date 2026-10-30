
function PickupView({
                        orders,
                        ordersLoading,
                        ordersError,
                        handleStatusChange,
                        updatingOrderId,
                    }) {
    const completedOrders = orders
        .filter((order) => order.status === "COMPLETED")
        .sort((a, b) => new Date(a.date) - new Date(b.date))

    return (
        <section className="pickup-layout">
            <div className="section-heading pickup-heading">
                <span className="section-eyebrow">PUNTO DE RECOGIDA</span>
                <h2>Pedidos listos</h2>
                <p>Entrega el pedido y márcalo como recogido.</p>
            </div>

            {!ordersLoading && !ordersError && (
                <div className="pickup-counter">
          <span className="pickup-counter-number">
            {completedOrders.length}
          </span>
                    <span>
            {completedOrders.length === 1
                ? "pedido listo para recoger"
                : "pedidos listos para recoger"}
          </span>
                </div>
            )}

            {ordersLoading && <p>Cargando pedidos listos...</p>}

            {ordersError && (
                <p className="error-message" role="alert">
                    {ordersError}
                </p>
            )}

            {!ordersLoading && !ordersError && (
                <>
                    {completedOrders.length === 0 ? (
                        <div className="empty-state pickup-empty">
                            <h3>Todo al día</h3>
                            <p>No hay pedidos listos para recoger.</p>
                        </div>
                    ) : (
                        <div className="pickup-orders">
                            {completedOrders.map((order) => (
                                <article className="pickup-order-card" key={order.id}>
                  <span className="pickup-ready-label">
                    <span aria-hidden="true">●</span>
                    LISTO PARA RECOGER
                  </span>

                                    <h3 className="pickup-order-code">
                                        {order.code}
                                    </h3>

                                    <p className="pickup-order-caption">
                                        Confirma la entrega cuando el cliente recoja
                                        su pedido.
                                    </p>

                                    <button
                                        className="pickup-confirm-button"
                                        type="button"
                                        disabled={updatingOrderId !== null}
                                        onClick={() => handleStatusChange(order.id, "PICKED_UP")}
                                    >
                                        {updatingOrderId === order.id
                                            ? "Actualizando..."
                                            : "Marcar como recogido ✓"}
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default PickupView
