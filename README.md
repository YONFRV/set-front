# 💼 Investment Fund Management App

Aplicación web para la gestión de fondos de inversión, desarrollada con React + TypeScript + Vite. Permite a los usuarios consultar fondos disponibles (FPV y FIC), suscribirse a ellos, cancelar participaciones y revisar su historial de transacciones.

---

## 🚀 Tecnologías principales

| Tecnología | Versión |
|---|---|
| React | 18.3.1 |
| TypeScript | — |
| Vite | 6.3.5 |
| Tailwind CSS | 4.1.12 |
| React Router | 7.13.0 |
| Axios | ^1.13.6 |
| shadcn/ui + Radix UI | — |
| Material UI (MUI) | 7.3.5 |
| Recharts | 2.15.2 |
| Sonner (toasts) | 2.0.3 |

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── App.tsx                  # Componente raíz
│   ├── routes.tsx               # Configuración de rutas
│   ├── context/
│   │   └── AppContext.tsx       # Estado global (auth, fondos, transacciones)
│   ├── pages/
│   │   ├── LoginPage.tsx        # Pantalla de inicio de sesión
│   │   ├── DashboardPage.tsx    # Panel principal con fondos disponibles
│   │   ├── MyFundsPage.tsx      # Fondos suscritos por el usuario
│   │   ├── HistoryPage.tsx      # Historial de transacciones
│   │   ├── MobileLayout.tsx     # Layout responsive (móvil)
│   │   ├── Layout.tsx           # Layout escritorio
│   │   ├── FundCard.tsx         # Tarjeta de fondo individual
│   │   ├── SubscriptionModal.tsx # Modal para suscribirse a un fondo
│   │   └── NotFoundPage.tsx     # Página 404
│   ├── services/
│   │   ├── api.ts               # Instancia de Axios + interceptor JWT
│   │   ├── authService.ts       # Login y registro
│   │   ├── fondService.ts       # Consulta de fondos
│   │   ├── customService.ts     # Datos del cliente por email
│   │   └── transaction.ts      # Historial y creación de transacciones
│   └── components/
│       └── ui/                  # Componentes UI reutilizables (shadcn/ui)
├── main.tsx
└── styles/
    ├── index.css
    ├── tailwind.css
    ├── fonts.css
    └── theme.css
```

---

## ⚙️ Configuración

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Investment Fund Management
```

> Para desarrollo local puedes copiar el archivo `.env-local` incluido en el proyecto.

---

## 🛠️ Instalación y ejecución

### Prerrequisitos

- Node.js >= 18
- npm >= 9

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

La aplicación estará disponible en `http://localhost:5173` por defecto.

---

## 🗺️ Rutas de la aplicación

| Ruta | Componente | Descripción |
|---|---|---|
| `/login` | `LoginPage` | Inicio de sesión |
| `/` | `DashboardPage` | Fondos disponibles y resumen |
| `/my-funds` | `MyFundsPage` | Fondos activos del usuario |
| `/history` | `HistoryPage` | Historial de transacciones |
| `/*` | — | Redirige a `/` |

---

## 🔌 API — Endpoints consumidos

La aplicación se conecta al backend configurado en `VITE_API_URL`. Todos los endpoints protegidos envían el token JWT en el header `Authorization: Bearer <token>`.

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/auth/login` | Autenticación de usuario |
| `POST` | `/auth/register` | Registro de nuevo usuario |
| `GET` | `/api/v1/fund/all-founts` | Lista todos los fondos disponibles |
| `GET` | `/api/v1/configuration-soft/:userId` | Datos del cliente por ID |
| `GET` | `/api/v1/transaccion/historial/:userId` | Historial de transacciones |
| `POST` | `/api/v1/transaccion/apertura` | Crear suscripción a un fondo |

---

## 🧩 Funcionalidades principales

- **Autenticación** — Login con JWT; sesión persistida en `localStorage`.
- **Dashboard** — Visualiza saldo disponible, total invertido y fondos activos.
- **Fondos disponibles** — Listado de fondos FPV y FIC con monto mínimo de vinculación.
- **Suscripción** — Modal para ingresar monto y seleccionar canal de notificación (Email o SMS).
- **Mis fondos** — Vista de los fondos en los que el usuario está vinculado actualmente.
- **Historial** — Registro de todas las transacciones: aperturas y cancelaciones.
- **Notificaciones** — Toasts en tiempo real con resultado de cada operación (via Sonner).

---

## 🎨 Diseño de referencia

El diseño original del proyecto está disponible en Figma:  
👉 [Investment Fund Management App — Figma](https://www.figma.com/design/uLWLnqGR652z11vrkjfMm1/Investment-Fund-Management-App)

---

## 📝 Notas adicionales

- El proyecto incluye un contexto alternativo (`AppContextV1.tsx`) que puede usarse como fallback.
- La función `refreshUser` permite recargar los datos del usuario desde el backend sin necesidad de volver a hacer login.
- El balance inicial por defecto para nuevos registros locales es **$500,000 COP**.
