# Hotel Management System

## Descripción
Sistema de gestión hotelera desarrollado con React, TypeScript y Material-UI. Permite gestionar clientes, habitaciones y reservas de un hotel.

## Características
- Gestión de clientes
- Gestión de habitaciones
- Sistema de reservas
- Interfaz responsive
- Persistencia local de datos

## Tecnologías
- React 18
- TypeScript
- Material-UI
- React Router
- RxJS
- Vite

## Instalación
1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Iniciar en modo desarrollo: `npm run dev`

## Estructura del Proyecto
- `/src/components`: Componentes React organizados por funcionalidad
- `/src/pages`: Páginas principales de la aplicación
- `/src/interfaces`: Definiciones de tipos TypeScript
- `/src/services`: Servicios para manejo de datos
- `/src/utils`: Utilidades y funciones helper

## Scripts Disponibles
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run lint`: Ejecuta el linter
- `npm run preview`: Previsualiza la versión de producción

hotel-management/
├── src/
│   ├── components/
│   │   ├── ClientManagement.tsx
│   │   ├── RoomManagement.tsx
│   │   ├── ReservationManagement.tsx
│   │   ├── Navbar.tsx
│   │   └── Layout.tsx
│   ├── interfaces/
│   │   └── index.ts
│   ├── services/
│   │   └── localStorage.ts
│   ├── utils/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md