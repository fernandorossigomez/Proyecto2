
function PickupView({
                        orders,
                        ordersLoading,
                        ordersError,
                    }) {
    const completedOrders = orders
        .filter((order) => order.status === 'COMPLETED')
        .sort((a, b) => new Date(a.date) - new Date(b.date))

    return (
        <section>
            <h2>Pantalla de recogida</h2>

            {ordersLoading && <p>Cargando pedidos listos...</p>}

            {ordersError && <p role="alert">{ordersError}</p>}

            {!ordersLoading && !ordersError && (
                <>
                    {completedOrders.length === 0 ? (
                        <p>No hay pedidos listos para recoger.</p>
                    ) : (
                        completedOrders.map((order) => (
                            <article key={order.id}>
                                <h3>{order.code}</h3>
                            </article>
                        ))
                    )}
                </>
            )}
        </section>
    )
}

export default PickupView
