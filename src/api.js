
const API_URL = "http://localhost:8080";

async function getErrorMessage(response, fallback) {
    const responseText = await response.text();

    if (!responseText) {
        return fallback;
    }

    try {
        const errorData = JSON.parse(responseText);
        return errorData.error || errorData.message || fallback;
    } catch {
        return responseText || fallback;
    }
}

export async function getProducts() {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, 'Failed to fetch products')
        );
    }

    return await response.json();
}

export async function createOrder(total, terminalId) {
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ total, terminalId }),
    })

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, 'No se pudo crear pedido')
        );
    }

    return await response.json()
}

export async function addProductToOrder(orderId, productId, quantity) {
    const response = await fetch(`${API_URL}/orders/${orderId}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
    })

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, 'No se pudo añadir producto al pedido ')
        );
    }

    return await response.json()
}


export async function getOrders(status) {
    const query = status ? `?status=${encodeURIComponent(status)}` : ''
    const response = await fetch(`${API_URL}/orders${query}`)

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, 'No se pudieron cargar los pedidos')
        );
    }

    return await response.json()
}

export async function updateOrderStatus(orderId, status) {
    const response = await fetch(
        `${API_URL}/orders/${orderId}/status?status=${encodeURIComponent(status)}`,
        {
            method: 'PATCH',
        }
    )

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, 'No se pudo actualizar el status del pedido.')
        );
    }

    return
}

