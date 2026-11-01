# Sistema de gestión de pedidos de restaurante

Aplicación frontend desarrollada con React y Vite para gestionar los pedidos de un restaurante desde tres vistas: terminal de pedidos, cocina y pantalla de recogida. La aplicación consume la API REST del backend desarrollado con Spring Boot.

## Funcionalidades

### 1. Terminal de pedidos
- Consulta y visualización de los productos disponibles.
- Añadir productos al pedido actual.
- Incrementar y reducir las cantidades de los productos.
- Cálculo del total del pedido.
- Envío del pedido al backend.
- Visualización del código del pedido generado.
- Mensajes de carga y errores durante las peticiones.

### 2. Cocina
- Consulta de pedidos pendientes y en preparación.
- Visualización del código, estado, productos, cantidades y total.
- Cambio de estado de pendiente a en preparación.
- Cambio de estado de en preparación a completado.
- Posibilidad de cancelar pedidos.
- Los pedidos cancelados dejan de aparecer en la vista de cocina.

### 3. Pantalla de recogida
- Visualización de los códigos de los pedidos completados.
- Ordenación de los pedidos por fecha de creación, del más antiguo al más reciente.
- Presentación simplificada para facilitar la identificación de los pedidos listos.

## Tecnologías utilizadas

- React
- JavaScript
- Vite
- React Router
- Fetch API para las peticiones HTTP
- CSS
- Backend REST desarrollado con Spring Boot

## Requisitos previos

- Node.js y npm instalados.
- Backend Spring Boot ejecutándose en `http://localhost:8080`.
- Base de datos y datos necesarios configurados en el backend.

## Instalación y ejecución

1. Clonar el repositorio o descargar el proyecto.
2. Abrir una terminal en la carpeta raíz del frontend.
3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir en el navegador la dirección indicada por Vite, normalmente `http://localhost:5173`.

El backend debe estar iniciado antes de utilizar las funcionalidades que requieren acceso a la API.

## Endpoints utilizados

La aplicación consume los siguientes endpoints del backend:

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/products` | Obtener los productos disponibles. |
| GET | `/terminals` | Obtener los terminales disponibles. |
| POST | `/orders` | Crear un pedido. |
| GET | `/orders?status={status}` | Consultar pedidos por estado. |
| POST | `/orders/{orderId}/products` | Añadir productos a un pedido. |
| PATCH | `/orders/{id}/status?status={status}` | Actualizar el estado de un pedido. |

Los estados utilizados por la aplicación son los definidos por el backend:

- `PENDING`: pendiente.
- `IN_PREPARATION`: en preparación.
- `COMPLETED`: completado.
- `CANCELLED`: cancelado.
- `PICKED_UP`: recogido por el cliente.

La aplicación consulta los pedidos pendientes y en preparación en la vista de cocina, y los pedidos completados en la pantalla de recogida.

## Flujo de uso

1. El terminal obtiene los productos disponibles desde la API.
2. El usuario selecciona los productos y sus cantidades.
3. La aplicación calcula el total y envía la solicitud de creación del pedido.
4. Una vez creado, añade los productos seleccionados al pedido.
5. La cocina consulta el pedido y actualiza su estado durante la preparación.
6. Cuando el pedido pasa a `COMPLETED`, deja de aparecer en cocina y se muestra en la pantalla de recogida mediante su código.
7. Una vez entregado al cliente, el pedido se marca como `PICKED_UP`.

## Estructura del proyecto

La aplicación se organiza en componentes y módulos separados según sus responsabilidades:

- `src/api.js`: centraliza las peticiones HTTP al backend.
- `src/App.jsx`: coordina las vistas, el estado compartido y las operaciones principales.
- `src/TerminalView.jsx`: interfaz del terminal de pedidos.
- `src/KitchenView.jsx`: interfaz de cocina.
- `src/PickupView.jsx`: pantalla de recogida.
- `src/App.css`: estilos de la aplicación.

Los demás archivos de configuración y entrada de React se mantienen según la estructura del proyecto creado con Vite.

## Gestión de errores

Las peticiones HTTP comprueban si la respuesta es correcta. Cuando el backend devuelve un error, la aplicación intenta mostrar el mensaje recibido y, si no está disponible, utiliza un mensaje alternativo.

Las vistas también muestran mensajes de carga y estados vacíos cuando corresponde.

## Decisiones y limitaciones conocidas

- La aplicación no incorpora autenticación ni gestión de usuarios.
- La lógica de negocio y la persistencia de los pedidos corresponden al backend.
- El terminal asociado a cada pedido se selecciona desde la interfaz. El terminal seleccionado debe existir en el backend.
- La creación del pedido y la incorporación de sus productos se realizan mediante peticiones HTTP consecutivas.
- La dirección de la API está configurada en el frontend como `http://localhost:8080`, por lo que debe adaptarse si el backend se ejecuta en otra dirección.

## Posibles mejoras futuras

- Configurar la URL de la API mediante variables de entorno.
- Incorporar actualización periódica o en tiempo real de los pedidos.
- Mejorar el diseño adaptable a distintos tamaños de pantalla.
- Añadir controles para evitar operaciones repetidas mientras se procesan las solicitudes.
- Mejorar la gestión de errores cuando una operación del pedido se completa parcialmente.