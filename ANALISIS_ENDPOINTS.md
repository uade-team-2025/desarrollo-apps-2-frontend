# Análisis de Endpoints de la Plataforma

## 📋 Resumen

Este documento analiza todos los endpoints utilizados en la plataforma, clasificándolos según si pertenecen a:
- **Vistas de Usuario**: Endpoints utilizados por usuarios regulares en la plataforma pública
- **Dashboard de Administración**: Endpoints utilizados exclusivamente en el panel de administración
- **Ambos Flujos**: Endpoints compartidos entre usuarios y administradores

---

## 🔵 Endpoints para Vistas de Usuario

### Autenticación y Usuario
- **POST** `/api/v1/users/login-without-password`
  - Login de usuario sin contraseña
  - Usado en: `src/core/login/login.api.ts`

- **POST** `https://auth.grupoldap.com.ar/v1/auth/validate`
  - Validación de token JWT con backend LDAP
  - Usado en: `src/core/login/ldap.api.ts`

- **GET** `http://ec2-44-217-132-156.compute-1.amazonaws.com/auth?redirectUrl=...`
  - URL de redirección para login LDAP
  - Usado en: `src/core/login/ldap.api.ts`

### Eventos
- **GET** `/api/v1/events/active`
  - Obtener eventos activos
  - Usado en: 
    - `src/modules/festival-announcement/festival-announcement.api.ts`
    - `src/modules/calendar-events/events-calendar.api.ts`

- **GET** `/api/v1/events/:id`
  - Obtener un evento específico por ID
  - Usado en: `src/modules/events/single-event.api.ts`

- **GET** `/api/v1/events/cultural-place/:id`
  - Obtener eventos por lugar cultural
  - Usado en: `src/modules/cultural-places/single-cultural-places/cultural-places.api.ts`

### Lugares Culturales
- **GET** `/api/v1/cultural-places`
  - Listar todos los lugares culturales
  - Usado en: `src/modules/cultural-places/cultural-places-list/cultural-places-list.api.ts`

- **GET** `/api/v1/cultural-places/:id`
  - Obtener un lugar cultural específico por ID
  - Usado en: `src/modules/cultural-places/single-cultural-places/cultural-places.api.ts`

### Tickets
- **GET** `/api/v1/tickets/user/:userId`
  - Obtener tickets de un usuario específico
  - Usado en: `src/modules/my-tickets/my-tickets.api.ts`

- **GET** `/api/v1/tickets/:id`
  - Obtener un ticket específico por ID
  - Usado en: `src/modules/ticket/ticket.api.ts`

- **PATCH** `/api/v1/tickets/:id/use`
  - Marcar un ticket como usado
  - Usado en: `src/modules/ticket/ticket.api.ts`

- **POST** `/api/v1/tickets/purchase`
  - Comprar tickets (múltiples tickets en una sola transacción)
  - Usado en: `src/modules/checkout/checkout.api.ts`

### Movilidad y Residuos
- **GET** `/api/v1/mobility/stations/:eventId`
  - Obtener estaciones de bicicletas para un evento
  - Usado en: `src/modules/events/single-event.api.ts`
  - Polling cada 5 segundos

- **GET** `/api/v1/residuos/trucks/event/:eventId`
  - Obtener posiciones de camiones de residuos para un evento
  - Usado en: `src/modules/events/single-event.api.ts`
  - Polling cada 5 segundos

### Recomendaciones (N8N Webhooks)
- **POST** `/webhook/0ed2f40a-911e-4e2d-877c-76844bfd4c92`
  - Obtener recomendaciones personalizadas basadas en preferencias
  - Usado en: `src/modules/preference-recommendations/preference-recommendations.api.ts`
  - Timeout: 600 segundos (10 minutos)

- **POST** `/webhook/recomendation`
  - Endpoint alternativo para recomendaciones
  - Usado en: `src/modules/recomendations/recomendations.api.ts`

### Rutas (GraphHopper - Servicio Externo)
- **GET** `https://graphhopper.com/route?key=...&profile=...&points=...&points_encoded=true&instructions=true&locale=es`
  - Calcular rutas entre puntos geográficos
  - Usado en: `src/core/components/route-map/route-map.api.ts`
  - Servicio externo (GraphHopper)

---

## 🔴 Endpoints para Dashboard de Administración

### Dashboard Principal
- **GET** `/api/v1/events`
  - Listar todos los eventos (para estadísticas)
  - Usado en: `src/modules/administator-panel/dashboard/dashboard.api.ts`

- **GET** `/api/v1/events/active`
  - Obtener eventos activos (para estadísticas)
  - Usado en: `src/modules/administator-panel/dashboard/dashboard.api.ts`

- **GET** `/api/v1/cultural-places`
  - Listar todos los lugares culturales (para estadísticas)
  - Usado en: `src/modules/administator-panel/dashboard/dashboard.api.ts`

### Gestión de Eventos (Admin)
- **POST** `/api/v1/events`
  - Crear un nuevo evento
  - Usado en: `src/modules/administator-panel/events/components/create-event-modal.tsx`

- **PUT** `/api/v1/events/:id`
  - Actualizar un evento existente
  - Usado en: `src/modules/administator-panel/events/components/edit-event-modal.tsx`

- **DELETE** `/api/v1/events/:id`
  - Eliminar un evento
  - Usado en: `src/modules/administator-panel/events/components/event-card.tsx`

- **GET** `/api/v1/events`
  - Listar todos los eventos para gestión
  - Usado en: `src/modules/administator-panel/events/events.api.ts`

### Gestión de Lugares Culturales (Admin)
- **POST** `/api/v1/cultural-places`
  - Crear un nuevo lugar cultural
  - Usado en: `src/modules/administator-panel/cultural-places/components/create-cultural-place-modal.tsx`

- **PUT** `/api/v1/cultural-places/:id`
  - Actualizar un lugar cultural existente
  - Usado en: `src/modules/administator-panel/cultural-places/components/edit-cultural-place-modal.tsx`

- **DELETE** `/api/v1/cultural-places/:id`
  - Eliminar un lugar cultural
  - Usado en: `src/modules/administator-panel/cultural-places/components/cultural-place-card.tsx`

- **GET** `/api/v1/cultural-places`
  - Listar todos los lugares culturales para gestión
  - Usado en: `src/modules/administator-panel/cultural-places/cultural-places.api.ts`

### Gestión de Usuarios (Admin)
- **GET** `/api/v1/users?role=...&isActive=...`
  - Listar usuarios con filtros (rol, estado activo)
  - Usado en: `src/modules/administator-panel/users/users.api.ts`

- **GET** `/api/v1/users/:id`
  - Obtener un usuario específico por ID
  - Usado en: `src/modules/administator-panel/users/users.api.ts`

- **POST** `/api/v1/users`
  - Crear un nuevo usuario
  - Usado en: `src/modules/administator-panel/users/users.api.ts`

- **PUT** `/api/v1/users/:id`
  - Actualizar un usuario existente
  - Usado en: `src/modules/administator-panel/users/components/user-edit-dialog.tsx`

- **DELETE** `/api/v1/users/:id`
  - Eliminar un usuario
  - Usado en: `src/modules/administator-panel/users/components/user-card.tsx`

- **PUT** `/api/v1/users/:id/toggle-active`
  - Activar/desactivar un usuario
  - Usado en: `src/modules/administator-panel/users/users.api.ts`

### Gestión de Tickets (Admin)
- **GET** `/api/v1/tickets?status=...&eventId=...&userId=...&ticketType=...`
  - Listar tickets con filtros múltiples
  - Usado en: `src/modules/administator-panel/tickets/tickets.api.ts`

- **GET** `/api/v1/tickets/:id`
  - Obtener un ticket específico por ID
  - Usado en: `src/modules/administator-panel/tickets/tickets.api.ts`

- **GET** `/api/v1/tickets/stats`
  - Obtener estadísticas de tickets
  - Usado en: `src/modules/administator-panel/tickets/tickets.api.ts`

- **GET** `/api/v1/tickets/status/:status`
  - Obtener tickets por estado
  - Usado en: `src/modules/administator-panel/tickets/tickets.api.ts`

- **GET** `/api/v1/tickets/active`
  - Obtener tickets activos
  - Usado en: `src/modules/administator-panel/tickets/tickets.api.ts`

- **PUT** `/api/v1/tickets/:id`
  - Actualizar estado de un ticket
  - Usado en: `src/modules/administator-panel/tickets/tickets.api.ts`

- **POST** `/api/v1/tickets/:id/cancel`
  - Cancelar un ticket
  - Usado en: `src/modules/administator-panel/tickets/tickets.api.ts`

- **PATCH** `/api/v1/tickets/:id/use`
  - Marcar un ticket como usado (mismo endpoint que usuarios, pero usado en contexto admin)
  - Usado en: `src/modules/administator-panel/tickets/tickets.api.ts`

**Nota**: El archivo `src/modules/administator-panel/tickets/tickets.api.ts` tiene una URL base hardcodeada diferente: `https://desarrollo-apps2-back-end.vercel.app/api/v1`, mientras que el resto usa `API_BASE_URL` del config.

---

## 🟢 Endpoints Usados en Ambos Flujos

### Eventos
- **GET** `/api/v1/events/active`
  - **Usado en vistas de usuario**: 
    - Anuncio de festival (`src/modules/festival-announcement/festival-announcement.tsx`)
    - Calendario de eventos (`src/modules/calendar-events/events-calendar.api.ts`)
  - **Usado en dashboard admin**: 
    - Estadísticas del dashboard (`src/modules/administator-panel/dashboard/dashboard.api.ts`)

- **GET** `/api/v1/events`
  - **Usado en dashboard admin**: 
    - Lista de eventos para gestión (`src/modules/administator-panel/events/events.api.ts`)
    - Estadísticas del dashboard (`src/modules/administator-panel/dashboard/dashboard.api.ts`)
  - **Nota**: También podría ser usado en vistas de usuario, pero no se encontró uso directo en el código actual

### Lugares Culturales
- **GET** `/api/v1/cultural-places`
  - **Usado en vistas de usuario**: 
    - Lista de lugares culturales (`src/modules/cultural-places/cultural-places-list/cultural-places-list.api.ts`)
  - **Usado en dashboard admin**: 
    - Lista de lugares culturales para gestión (`src/modules/administator-panel/cultural-places/cultural-places.api.ts`)
    - Estadísticas del dashboard (`src/modules/administator-panel/dashboard/dashboard.api.ts`)
    - Selector en formularios de eventos (`src/modules/administator-panel/events/components/create-event-modal.tsx`)

### Tickets
- **GET** `/api/v1/tickets/:id`
  - **Usado en vistas de usuario**: 
    - Visualización de ticket individual (`src/modules/ticket/ticket.api.ts`)
  - **Usado en dashboard admin**: 
    - Gestión de tickets (`src/modules/administator-panel/tickets/tickets.api.ts`)

- **PATCH** `/api/v1/tickets/:id/use`
  - **Usado en vistas de usuario**: 
    - Validar ticket en punto de entrada (`src/modules/ticket/ticket.api.ts`)
  - **Usado en dashboard admin**: 
    - Gestión de tickets (`src/modules/administator-panel/tickets/tickets.api.ts`)

---

## 📊 Estadísticas

### Total de Endpoints Únicos: **43**

#### Por Categoría:
- **Solo Vistas de Usuario**: 15 endpoints
- **Solo Dashboard Admin**: 20 endpoints
- **Compartidos (Ambos Flujos)**: 8 endpoints

#### Por Método HTTP:
- **GET**: 26 endpoints
- **POST**: 8 endpoints
- **PUT**: 5 endpoints
- **PATCH**: 2 endpoints
- **DELETE**: 4 endpoints

#### Por Base de URL:
- **API Principal** (`/api/v1/`): 36 endpoints
- **Servicios Externos**: 
  - LDAP Auth: 2 endpoints
  - GraphHopper: 1 endpoint
  - N8N Webhooks: 2 endpoints
- **Hardcoded en tickets.admin.api.ts**: 9 endpoints (diferente base URL)

---

## 🔍 Observaciones y Recomendaciones

### 1. Inconsistencia en URLs Base
El archivo `src/modules/administator-panel/tickets/tickets.api.ts` tiene una URL base hardcodeada (`https://desarrollo-apps2-back-end.vercel.app/api/v1`) en lugar de usar `API_BASE_URL` del config. **Recomendación**: Unificar para usar la variable de entorno.

### 2. Endpoints Compartidos
Varios endpoints son compartidos entre usuarios y administradores, pero probablemente tienen diferentes permisos en el backend. Asegurar que el backend valide correctamente los roles.

### 3. Servicios Externos
- GraphHopper requiere API key
- LDAP Auth usa URLs diferentes para validación y login
- N8N webhooks tienen timeout extendido (600s)

### 4. Polling
Los endpoints de movilidad y residuos tienen polling de 5 segundos, lo cual puede generar mucha carga. Considerar WebSockets para actualizaciones en tiempo real.

### 5. Timeout Extendido
El endpoint de recomendaciones tiene un timeout de 600 segundos, lo cual es muy alto. Considerar implementar un patrón de polling o WebSocket si el procesamiento es tan largo.

---

## 📝 Archivos Analizados

### Archivos de API (.api.ts):
- `src/core/config/api.config.ts` - Configuración base
- `src/core/components/route-map/route-map.api.ts`
- `src/core/login/login.api.ts`
- `src/core/login/ldap.api.ts`
- `src/modules/events/single-event.api.ts`
- `src/modules/recomendations/recomendations.api.ts`
- `src/modules/my-tickets/my-tickets.api.ts`
- `src/modules/ticket/ticket.api.ts`
- `src/modules/preference-recommendations/preference-recommendations.api.ts`
- `src/modules/checkout/checkout.api.ts`
- `src/modules/cultural-places/cultural-places-list/cultural-places-list.api.ts`
- `src/modules/cultural-places/single-cultural-places/cultural-places.api.ts`
- `src/modules/calendar-events/events-calendar.api.ts`
- `src/modules/festival-announcement/festival-announcement.api.ts`
- `src/modules/administator-panel/dashboard/dashboard.api.ts`
- `src/modules/administator-panel/events/events.api.ts`
- `src/modules/administator-panel/tickets/tickets.api.ts`
- `src/modules/administator-panel/users/users.api.ts`
- `src/modules/administator-panel/cultural-places/cultural-places.api.ts`

---

*Última actualización: Generado automáticamente mediante análisis del código fuente*

