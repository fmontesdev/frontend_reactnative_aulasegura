# 🛡️ AulaSegura - Admin Dashboard

Frontend web de **AulaSegura**, un panel de administración construido con **React Native Web**, **Expo Router**, **TypeScript**, **React Native Paper** y **TanStack Query**.

El objetivo del dashboard es ofrecer a administración una interfaz de escritorio para operar el sistema de control de acceso del centro: usuarios, estructura académica, aulas, lectores, credenciales, horarios, permisos semanales, reservas, validaciones, notificaciones y supervisión de accesos.

Este frontend está pensado para **web/escritorio** y para uso **administrativo**. Los scripts `android` e `ios` existen por herencia de Expo, pero actualmente se consideran trabajo futuro y no forman parte del flujo validado del proyecto.

---

## 📚 Tabla de contenidos

- [Descripción general](#-descripción-general)
- [Tecnologías](#-tecnologías)
- [Funcionalidades principales](#-funcionalidades-principales)
- [Arquitectura del proyecto](#-arquitectura-del-proyecto)
- [Módulos principales](#-módulos-principales)
- [Modelo de navegación](#-modelo-de-navegación)
- [Gestión de estado y datos](#-gestión-de-estado-y-datos)
- [Autenticación y sesión](#-autenticación-y-sesión)
- [Formularios y validación](#-formularios-y-validación)
- [Diseño visual y componentes](#-diseño-visual-y-componentes)
- [Integración con backend](#-integración-con-backend)
- [Configuración de entorno](#-configuración-de-entorno)
- [Docker Compose](#-docker-compose)
- [Instalación y arranque](#-instalación-y-arranque)
- [Verificación y calidad](#-verificación-y-calidad)
- [Detalles importantes del proyecto](#-detalles-importantes-del-proyecto)
- [Estructura de directorios](#-estructura-de-directorios)
- [Estado de licencia](#-estado-de-licencia)

---

## 📋 Descripción general

AulaSegura permite controlar quién puede acceder a cada aula, en qué horario y con qué credencial. Este dashboard es la capa operativa para administradores: muestra datos del backend, permite gestionar entidades del dominio y facilita la trazabilidad de accesos en tiempo real.

La aplicación no es una simple colección de pantallas CRUD. Refleja reglas reales del dominio del backend:

- Un profesor puede tener asignaciones docentes por **curso + asignatura**.
- Un permiso semanal puede vincularse a una asignación docente concreta.
- Un horario semanal se gestiona como entidad reutilizable antes de asignar permisos.
- Una reserva o pase temporal se modela como evento puntual y puede requerir validación.
- Los accesos se supervisan mediante logs, analíticas y eventos SSE.
- Las credenciales NFC/RFID y QR se gestionan desde flujos separados.

### Alcance actual

- **Objetivo principal**: dashboard administrativo web.
- **Plataforma validada**: navegador de escritorio mediante React Native Web.
- **Backend esperado**: API NestJS de AulaSegura.
- **Validación técnica disponible**: TypeScript (`npx tsc --noEmit`).
- **Sin linter ni runner de tests configurados** en este repositorio.

---

## 🛠️ Tecnologías

### Core

- **Expo 54** como runtime y configuración base.
- **React 19** y **React Native 0.81** como base de UI.
- **React Native Web 0.21** para renderizado en navegador.
- **Expo Router 6** para routing file-based.
- **TypeScript 5.9** en modo estricto.

### UI y experiencia

- **React Native Paper 5** con Material Design 3.
- **@expo-google-fonts/roboto** para tipografía Roboto.
- **React Native Paper Dates** para selección de fechas.
- **React QR Code** para generación de QR de lectores.
- **Victory Native** disponible para visualizaciones.

### Datos y formularios

- **TanStack Query 5** para server state, caché e invalidación.
- **Axios 1** con interceptores de autenticación y refresh.
- **React Hook Form 7** para formularios controlados.
- **Zod 3** para validación de esquemas y coerción de inputs.
- **Expo Secure Store** preparado para almacenamiento seguro en native; en web el flujo usa access token en memoria y refresh token en cookie httpOnly.

---

## ✨ Funcionalidades principales

- 🔐 **Autenticación administrativa** con login, sesión global, silent refresh y logout sincronizado entre pestañas.
- 👥 **Gestión de usuarios** con roles, avatar, departamento, validez temporal y resumen académico docente.
- 📚 **Estructura académica** con cursos, asignaturas, departamentos y asignaciones docentes.
- 🏫 **Espacios y dispositivos** con aulas y lectores RFID/QR.
- 🏷️ **Credenciales** NFC físicas, NFC móviles y generación de QR por lector.
- 📅 **Control de acceso** con horarios semanales, permisos recurrentes, reservas/pases y validaciones pendientes.
- 📡 **Supervisión en tiempo real** mediante SSE para eventos de acceso.
- 📖 **Historial y analíticas** de accesos permitidos, denegados, timeout y salida.
- 🔔 **Notificaciones** con contador de no leídas, marcado como leído, envío y eventos en tiempo real.
- 🔎 **Filtros globales** sincronizados con URL y paginación persistente por pantalla.

---

## 🏗️ Arquitectura del proyecto

El frontend sigue una arquitectura por capas sencilla y explícita. Las pantallas viven en `src/app/` por el routing file-based de Expo Router; la lógica de servidor se concentra en hooks de TanStack Query y servicios HTTP.

| Capa | Ubicación | Responsabilidad |
|------|-----------|-----------------|
| Rutas / pantallas | `src/app/` | Páginas renderizadas por Expo Router. Orquestan UI, hooks y navegación. |
| Componentes | `src/components/` | UI reutilizable: tablas, formularios, tabs, layout, feedback y widgets. |
| Hooks de datos | `src/hooks/queries/` | Query keys, queries y mutations por entidad. |
| Servicios HTTP | `src/services/` | Llamadas Axios al backend. Sin lógica visual. |
| Schemas | `src/schemas/` | Validación Zod y normalización de formularios. |
| Tipos | `src/types/` | Contratos TypeScript de entidades, DTOs y respuestas. |
| Contextos | `src/contexts/` | Autenticación, filtros, eventos SSE y notificaciones en vivo. |
| Tema | `src/theme.ts` | MD3 extendido con tokens propios de AulaSegura. |
| Configuración | `src/constants.ts` | URLs de API, servidor de imágenes y constantes globales. |

### Convenciones importantes

- Los servicios no contienen lógica de presentación.
- Cada hook de query exporta una **key factory** (`userKeys`, `permissionKeys`, `scheduleKeys`, etc.).
- Las mutaciones invalidan las queries relacionadas de forma explícita.
- Los formularios usan componentes controlados con `Controller` porque React Native Paper no encaja con `register` directo.
- El tema debe consumirse con `useAppTheme()`, no con `useTheme()` sin tipar.
- Las URLs de imágenes deben construirse con `apiService.getImageUrl()`.

---

## 🧩 Módulos principales

| Módulo | Ruta base | Estado | Responsabilidad |
|--------|-----------|--------|-----------------|
| Inicio | `/home` | Implementado | KPIs, widgets y accesos rápidos. |
| Usuarios | `/users` | Implementado | Listado, creación, edición, eliminación, roles, avatar y departamento. |
| Estructura académica | `/academic/*` | Implementado | Cursos, asignaturas, departamentos y asignaciones docentes. |
| Espacios y dispositivos | `/spaces/*` | Implementado | Aulas y lectores. |
| Credenciales | `/credentials/*` | Implementado | NFC físicas, NFC móviles y generación de QR. |
| Control de acceso | `/access/*` | Implementado | Horarios, permisos semanales, reservas/pases y validaciones. |
| Supervisión | `/supervision/*` | Implementado | Eventos SSE, historial de accesos y analíticas. |
| Notificaciones | `/notifications/*` | Implementado | Bandeja, no leídas, envío y marcado como leído. |
| Configuración | `/settings` | Placeholder | Configuración global pendiente. |

### Control de acceso

El módulo de Control de acceso concentra la parte más sensible del dominio:

| Pestaña | Ruta | Descripción |
|--------|------|-------------|
| Horarios | `/access/schedules` | Gestión de slots semanales. Usa `GET /schedules`, `POST /weekly-schedules`, `PATCH /weekly-schedules/:id` y soft delete con `DELETE /schedules/:id`. |
| Permisos semanales | `/access/permissions` | Grilla lunes-viernes por usuario. Permite crear, editar y desactivar permisos recurrentes. Profesores requieren `assignmentId`. |
| Reservas / pases | `/access/reservations` | Listado consultivo de eventos y formulario de creación de reserva propia. |
| Validaciones | `/access/validations` | Cola de reservas pendientes con aprobación o denegación motivada. |

Reglas relevantes:

- Los permisos semanales se identifican por `userId + roomId + scheduleId`.
- Las actualizaciones de permisos usan campos delta (`newRoomId`, `newScheduleId`, `newAssignmentId`, etc.).
- Para profesores, `assignmentId` vincula el permiso a una asignación docente concreta.
- Para usuarios no docentes, `assignmentId` se omite.
- Las reservas/pases eventuales no usan asignación docente.

### Credenciales

El dashboard contempla tres flujos:

- **NFC físicas**: gestión administrativa de tags físicos.
- **NFC móviles**: gestión de credenciales móviles emitidas por backend.
- **QR**: generación, descarga e impresión de QR por lector activo; el QR contiene exactamente el código del lector.

### Supervisión

- **Eventos de acceso**: feed SSE desde `/access/events`.
- **Historial de accesos**: tabla filtrable y paginada.
- **Analíticas**: KPIs, actividad por hora y rankings de aulas/usuarios con denegaciones.

---

## 🧭 Modelo de navegación

La navegación se basa en **Expo Router** con grupos de rutas:

```text
src/app/
├── _layout.tsx              # Providers globales
├── index.tsx                # Redirección inicial
├── (auth)/
│   └── login.tsx            # Pantalla pública de login
└── (app)/
    ├── _layout.tsx          # Shell autenticado: Sidebar + Topbar + filtros + SSE
    ├── home.tsx
    ├── users/
    ├── academic/
    ├── spaces/
    ├── credentials/
    ├── access/
    ├── supervision/
    ├── notifications/
    └── settings/
```

`src/app/(app)/_layout.tsx` no solo protege navegación: también monta el shell visual, los proveedores SSE y el `FilterProvider`.

### Shell principal

- **Sidebar** lateral con colapso automático por debajo de `1280px`.
- **Topbar** con búsqueda global, perfil y notificaciones.
- **ScrollView de contenido** con margen dinámico según estado del sidebar.
- **FadeView** para transición suave entre rutas.

### Tabs por dominio

Los módulos complejos usan `Tabs` con rutas reales:

- `/academic/courses`, `/academic/subjects`, `/academic/departments`, `/academic/assignments`
- `/spaces/classrooms`, `/spaces/readers`
- `/credentials/physical`, `/credentials/mobile`, `/credentials/qr`
- `/access/schedules`, `/access/permissions`, `/access/reservations`, `/access/validations`
- `/supervision/events`, `/supervision/logs`, `/supervision/analytics`
- `/notifications/unread`, `/notifications/all`, `/notifications/send`

---

## 🔄 Gestión de estado y datos

### TanStack Query

`src/config/queryClient.ts` define los defaults globales:

- `staleTime`: 60 segundos por defecto.
- Retry de queries: no reintenta errores 4xx; reintenta errores de red/5xx hasta 2 veces.
- Retry de mutations: no reintenta errores 4xx; reintenta errores de red/5xx una vez.
- `refetchOnWindowFocus` y `refetchOnReconnect` activados.

Los hooks de `src/hooks/queries/` encapsulan acceso a servidor:

| Hook | Entidad |
|------|---------|
| `useUsers` | Usuarios |
| `useCourses` | Cursos |
| `useSubjects` | Asignaturas |
| `useDepartments` | Departamentos |
| `useTeacherAssignments` | Asignaciones docentes |
| `useRooms` | Aulas |
| `useReaders` | Lectores |
| `useTags` | Credenciales |
| `useSchedules` | Horarios |
| `usePermissions` | Permisos y reservas |
| `useAccessLogs` | Historial de accesos |
| `useAccessAnalytics` | Analíticas |
| `useNotifications` | Notificaciones |

### Filtros globales

`FilterContext` sincroniza chips de filtro con `?filters=` en la URL:

```text
?filters=juan,rol:teacher,email:@centro.edu
```

Detalles importantes:

- Los filtros se limpian al navegar entre rutas.
- Se restauran al recargar la pantalla.
- Las comas se preservan legibles; no se fuerzan a `%2C`.
- El backend interpreta filtros libres y filtros con prefijo `campo:valor`.

### Paginación URL-first

`usePaginationParams` sincroniza `page` y `limit` con la URL:

```text
?page=2&limit=20&filters=rol:teacher
```

El hook retrasa la lectura inicial con `setTimeout(0)` para esperar a que Expo Router haya aplicado su `history.pushState`. No es accidental: evita leer una URL anterior durante el montaje.

---

## 🔐 Autenticación y sesión

La autenticación se centraliza en `AuthContext`, `authService`, `tokenService` e interceptores Axios.

### Flujo web

- El **access token** se guarda en memoria de módulo.
- El **refresh token** lo gestiona el navegador como cookie httpOnly emitida por backend.
- Al recargar, la memoria se pierde; `AuthContext` intenta silent refresh antes de enviar al usuario a login.
- Axios añade `Authorization: Bearer <token>` automáticamente.
- Si una request devuelve `401`, el interceptor intenta refrescar el token y reintenta la petición original.
- Hay una promesa compartida de refresh para evitar carreras cuando varias requests fallan a la vez.
- El logout se sincroniza entre pestañas mediante `BroadcastChannel`.

### Flujo native preparado

`tokenService` tiene ramas para `expo-secure-store`, pero native no es una plataforma validada aún en este dashboard.

---

## 🧾 Formularios y validación

Los formularios combinan **React Hook Form**, **Zod** y componentes controlados de React Native Paper.

Componentes principales:

| Componente | Uso |
|------------|-----|
| `FormTextInput` | Inputs de texto, textarea y campos deshabilitados. |
| `FormCheckbox` | Booleanos controlados. |
| `FormDatePicker` | Fecha con React Native Paper Dates. |
| `FormSegmentedButtons` | Selección por botones segmentados. |
| `FormMultiSelect` | Selección múltiple con chips. |
| `FormSingleSelect` | Selección única; soporta render custom para asignaciones y usuarios con avatar. |
| `AvatarPicker` | Selección/subida de avatar. |

Schemas relevantes:

- `auth.schema.ts`
- `user.schema.ts`
- `course.schema.ts`
- `subject.schema.ts`
- `department.schema.ts`
- `teacherAssignment.schema.ts`
- `room.schema.ts`
- `reader.schema.ts`
- `tag.schema.ts`
- `notification.schema.ts`
- `access.schema.ts`

`access.schema.ts` normaliza valores de selects numéricos con coerción Zod para evitar enviar strings donde el backend espera números.

---

## 🎨 Diseño visual y componentes

El diseño usa Material Design 3 sobre React Native Paper, extendido con tokens propios en `theme.ts`.

### Tokens de color destacados

- `success`, `onSuccess`
- `warning`, `onWarning`
- `darkGrey`, `grey`, `lightGrey`, `superlightGrey`
- `card`, `highlight`, `titles`
- `quaternary`, `quinary`

Siempre debe usarse:

```ts
import { useAppTheme } from '../theme';

const theme = useAppTheme();
```

### Componentes estructurales

| Componente | Responsabilidad |
|------------|-----------------|
| `Sidebar` | Navegación lateral colapsable. |
| `Topbar` | Búsqueda global, perfil y notificaciones. |
| `Tabs` | Navegación por pestañas con rutas reales. |
| `DataTable` | Tabla reutilizable con columnas configurables, ordenación y paginación. |
| `StyledCard` | Card MD3 consistente. |
| `StyledChip` | Chips de filtro/estado. |
| `StyledSnackbar` | Feedback de éxito/error. |
| `ConfirmDialog` | Confirmaciones reutilizables. |
| `TooltipWrapper` | Tooltip por Portal para evitar clipping por overflow. |

### Componentes de dominio

| Componente | Dominio |
|------------|---------|
| `UserForm` | Usuarios. |
| `TeacherAssignmentForm` | Asignaciones docentes. |
| `CourseForm` | Cursos. |
| `SubjectForm` | Asignaturas. |
| `DepartmentForm` | Departamentos. |
| `RoomForm` | Aulas. |
| `ReaderForm` | Lectores. |
| `WeeklyScheduleForm` | Horarios semanales. |
| `WeeklyPermissionForm` | Permisos semanales. |
| `EventPermissionForm` | Reservas / pases temporales. |

---

## 🔌 Integración con backend

El cliente HTTP central está en `src/services/apiService.ts`.

### Configuración base

- `baseURL`: `EXPO_PUBLIC_NESTJS_API_URL`
- `withCredentials: true` para cookies httpOnly.
- Timeout: 10 segundos.
- Manejo centralizado de errores mediante `ApiError`.
- Helper de imágenes: `apiService.getImageUrl(path)`.

### Contratos de respuesta habituales

Las listas paginadas siguen el contrato:

```ts
{
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}
```

### Endpoints consumidos por dominio

| Dominio | Servicios frontend | Endpoints principales |
|---------|--------------------|-----------------------|
| Auth | `authService` | `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` |
| Usuarios | `userService` | `/users`, avatar upload |
| Académico | `courseService`, `subjectService`, `departmentService`, `teacherAssignmentService` | `/courses`, `/subjects`, `/departments`, `/teachers/assignments` |
| Espacios | `roomService`, `readerService` | `/rooms`, `/readers` |
| Credenciales | `tagService` | `/tags`, `/tags/admin` |
| Horarios | `scheduleService`, `eventScheduleService` | `/schedules`, `/weekly-schedules`, `/event-schedules` |
| Permisos | `permissionService` | `/permissions`, `/permissions/weekly-schedule`, `/permissions/event-schedule` |
| Accesos | `accessLogService`, `accessAnalyticsService` | `/access/logs`, `/access/analytics/*`, `/access/events` |
| Notificaciones | `notificationService` | `/notifications`, `/notifications/unread-count`, `/notifications/events` |

---

## ⚙️ Configuración de entorno

El repositorio incluye `.env.example`:

```env
EXPO_PUBLIC_NESTJS_API_URL=http://localhost:8000
EXPO_PUBLIC_IMAGE_SERVER_URL=http://localhost:8090
```

| Variable | Uso |
|----------|-----|
| `EXPO_PUBLIC_NESTJS_API_URL` | API REST NestJS. |
| `EXPO_PUBLIC_IMAGE_SERVER_URL` | Servidor estático de imágenes y avatares. |

> ⚠️ Las variables `EXPO_PUBLIC_*` se incrustan en el bundle en tiempo de build/export. Si cambias `.env`, reconstruye la exportación o la imagen que lo necesite.

---

## 🐳 Docker Compose

El Dockerfile usa `node:24-alpine`, instala dependencias con `npm ci` y arranca Expo en modo web.

```bash
docker-compose up --build   # primera vez o tras cambios de dependencias
docker-compose up           # arranques posteriores
```

La app queda disponible en:

```text
http://localhost:8081
```

El código fuente se monta como volumen, por lo que hay hot reload sin reconstruir la imagen. `node_modules` se mantiene dentro del contenedor para evitar que el volumen local lo sobrescriba.

---

## 🚀 Instalación y arranque

### Requisitos

- Node.js compatible con Expo 54.
- npm.
- Backend AulaSegura levantado.
- Servidor de imágenes disponible si se quieren ver avatares.

### Arranque local

```bash
npm install
cp .env.example .env
npm run web
```

### Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run web` | Arranca Expo para web en desarrollo. |
| `npm run build:web` | Exporta producción web en `dist/`. |
| `npm start` | Arranca Expo genérico. |
| `npm run android` | Script futuro; no validado en este proyecto. |
| `npm run ios` | Script futuro; no validado en este proyecto. |

---

## ✅ Verificación y calidad

Este repositorio no tiene configurados ESLint, Prettier ni Jest. La verificación disponible es TypeScript:

```bash
npx tsc --noEmit
```

No uses comandos inexistentes como `npm run lint`, `npm test`, `jest` o `prettier` salvo que antes se añadan explícitamente al proyecto.

Para producción web:

```bash
npm run build:web
```

---

## ⚠️ Detalles importantes del proyecto

### Web primero

Aunque el stack sea React Native, este dashboard está diseñado y validado para web/escritorio. Evita introducir decisiones condicionadas por iOS/Android salvo que el trabajo indique explícitamente una fase native.

### No concatenar imágenes manualmente

Usa siempre:

```ts
apiService.getImageUrl(user.avatar)
```

### No enviar campos extra al backend

El backend usa validación estricta con whitelist y rechazo de propiedades no declaradas. Los payloads deben ajustarse al DTO real.

### Filtros con comas legibles

La URL debe conservar:

```text
?filters=juan,rol:admin,email:@gmail.com
```

No “arregles” automáticamente las comas convirtiéndolas en `%2C` si el flujo existente las preserva.

### Permisos semanales y asignaciones docentes

- `assignmentId` es obligatorio para permisos semanales de profesores.
- `assignmentId` no se envía para usuarios no docentes.
- En edición se envía `newAssignmentId`, no `assignmentId`.
- Los permisos legacy pueden venir con `assignment_id = NULL`; la UI permite asignar una asignación docente válida al editarlos.

### SSE

Los providers SSE se montan dentro del layout autenticado:

- `AccessLogEventsProvider` escucha `/access/events`.
- `NotificationEventsProvider` escucha `/notifications/events` e invalida queries de notificaciones.

---

## 📁 Estructura de directorios

```text
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   └── login.tsx
│   └── (app)/
│       ├── _layout.tsx
│       ├── home.tsx
│       ├── users/
│       ├── academic/
│       ├── spaces/
│       ├── credentials/
│       ├── access/
│       ├── supervision/
│       ├── notifications/
│       └── settings/
├── components/
├── config/
├── constants.ts
├── contexts/
├── data/
├── errors/
├── hooks/
│   └── queries/
├── schemas/
├── services/
├── theme.ts
├── types/
└── utils/
```

---

## 📄 Estado de licencia

El paquete está marcado como `private` en `package.json`. No hay licencia pública declarada en este repositorio.
