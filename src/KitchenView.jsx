
function KitchenView({
                         orders,
                         ordersLoading,
                         ordersError,
                         handleStatusChange,
                         updatingOrderId,
                     }) {
    const sortByDate = (a, b) =>
        new Date(a.date) - new Date(b.date)

    const pendingOrders = orders
        .filter((order) => order.status === 'PENDING')
        .sort(sortByDate)

    const preparingOrders = orders
        .filter((order) => order.status === 'IN_PREPARATION')
        .sort(sortByDate)

    const kitchenOrders = [
        ...pendingOrders,
        ...preparingOrders,
    ]

    async function cancelOrder(orderId) {
        const confirmed = window.confirm(
            "¿Seguro que quieres cancelar este pedido?"
        )

        if (confirmed) {
            await handleStatusChange(orderId, "CANCELLED")
        }
    }

    return (
        <section className="kitchen-layout">
            <div className="section-heading">
                <span className="section-eyebrow">OPERACIONES</span>
                <h2>Cocina</h2>
                <p>Gestiona los pedidos y actualiza su preparación.</p>
            </div>

            <div className="kitchen-summary">
                <div className="kitchen-counter">
          <span className="counter-number">
            {kitchenOrders.filter(
                (order) => order.status === "PENDING"
            ).length}
          </span>
                    <span className="counter-label">Pendientes</span>
                </div>

                <div className="kitchen-counter">
          <span className="counter-number">
            {kitchenOrders.filter(
                (order) => order.status === "IN_PREPARATION"
            ).length}
          </span>
                    <span className="counter-label">En preparación</span>
                </div>
            </div>

            {ordersLoading && <p>Cargando pedidos...</p>}

            {ordersError && (
                <p className="error-message" role="alert">
                    {ordersError}
                </p>
            )}

            {!ordersLoading &&
                !ordersError &&
                kitchenOrders.length === 0 && (
                    <div className="empty-state kitchen-empty">
                        <h3>Todo al día</h3>
                        <p>No hay pedidos pendientes de preparación.</p>
                    </div>
                )}

            {!ordersLoading && !ordersError && kitchenOrders.length > 0 && (
                <div className="kitchen-orders">
                    {kitchenOrders.map((order) => (
                        <article className="kitchen-order-card" key={order.id}>
                            <div className="kitchen-order-header">
                                <div>
                                    <span className="section-eyebrow">PEDIDO</span>
                                    <h3 className="kitchen-order-code">
                                        {order.code}
                                    </h3>
                                </div>

                                <span
                                    className={`status-badge ${
                                        order.status === "PENDING"
                                            ? "status-pending"
                                            : "status-preparing"
                                    }`}
                                >
                  {order.status === "PENDING"
                      ? "Pendiente"
                      : "En preparación"}
                </span>
                            </div>

                            <div className="kitchen-order-content">
                                <h4>Productos</h4>

                                <ul className="kitchen-product-list">
                                    {(order.products ?? []).map((item) => (
                                        <li key={item.productId}>
                                            <span>{item.name}</span>
                                            <strong>× {item.quantity}</strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="kitchen-order-footer">
                                <div className="kitchen-total">
                                    <span>Total</span>
                                    <strong>
                                        {Number(order.total ?? 0).toFixed(2)} €
                                    </strong>
                                </div>

                                {order.status === "PENDING" && (
                                    <button
                                        className="kitchen-action-button"
                                        type="button"
                                        disabled={updatingOrderId !== null}
                                        onClick={() =>
                                            handleStatusChange(
                                                order.id,
                                                "IN_PREPARATION"
                                            )
                                        }
                                    >
                                        {updatingOrderId === order.id
                                            ? "Actualizando..."
                                            : "Empezar preparación →"}
                                    </button>
                                )}

                                {order.status === "IN_PREPARATION" && (
                                    <button
                                        className="kitchen-action-button ready-button"
                                        type="button"
                                        disabled={updatingOrderId !== null}
                                        onClick={() =>
                                            handleStatusChange(order.id, "COMPLETED")
                                        }
                                    >
                                        {updatingOrderId === order.id
                                            ? "Actualizando..."
                                            : "Marcar como listo ✓"}
                                    </button>
                                )}

                                <button
                                    className="cancel-order-button"
                                    type="button"
                                    disabled={updatingOrderId !== null}
                                    onClick={() => cancelOrder(order.id)}
                                >
                                    {updatingOrderId === order.id
                                        ? "Actualizando..."
                                        : "Cancelar pedido"}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

export default KitchenView
