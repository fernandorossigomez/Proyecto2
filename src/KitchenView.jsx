
function KitchenView({
                         orders,
                         ordersLoading,
                         ordersError,
                         handleStatusChange,
                     }) {
    const kitchenOrders = orders.filter(
        (order) =>
            order.status === 'PENDING' ||
            order.status === 'IN_PREPARATION'
    )

    return (
        <section>
            <h2>Vista de Cocina</h2>

            {ordersLoading && <p>Cargando pedidos...</p>}

            {ordersError && <p role="alert">{ordersError}</p>}

            {!ordersLoading &&
                !ordersError &&
                kitchenOrders.length === 0 && (
                    <p>No hay pedidos pendientes de preparación.</p>
                )}

            {kitchenOrders.map((order) => (
                <article key={order.id}>
                    <h3>Pedido {order.code}</h3>
                    <p>
                        Estado: {
                        order.status === 'PENDING'
                            ? 'Pendiente'
                            : 'En preparación'
                    }
                    </p>

                    <ul>
                        {(order.products ?? []).map((item) => (
                            <li key={item.productId}>
                                {item.name} × {item.quantity}
                            </li>
                        ))}
                    </ul>

                    <p>
                        Total: {Number(order.total ?? 0).toFixed(2)} €
                    </p>

                    {order.status === 'PENDING' && (
                        <button
                            type="button"
                            onClick={() =>
                                handleStatusChange(order.id, 'IN_PREPARATION')
                            }
                        >
                            Empezar preparación
                        </button>
                    )}

                    {order.status === 'IN_PREPARATION' && (
                        <button
                            type="button"
                            onClick={() =>
                                handleStatusChange(order.id, 'COMPLETED')
                            }
                        >
                            Marcar como listo
                        </button>
                    )}
                </article>
            ))}
        </section>
    )
}

export default KitchenView
