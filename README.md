# Sistema de Gestión de Préstamos y Créditos

Aplicación web para [qué problema resuelve: ej. administrar créditos de nómina, pagos y saldos de clientes], desarrollada para un cliente real.

**Demo:** [link]  
**Usuario de prueba:** [usuario / clave de demo]

## Funcionalidades
- [Registro y gestión de clientes]
- [Creación de préstamos con cuotas e intereses]
- [Registro de pagos y saldo pendiente]
- [Autenticación / roles, si existen]
- [Reportes, si existen]

## Stack
NestJS · TypeScript · TypeORM · PostgreSQL (Supabase) · [React/Vite si hay frontend]

## Capturas
![Dashboard](./docs/dashboard.png)
![Listado de préstamos](./docs/prestamos.png)

## Cómo correrlo
```bash
git clone https://github.com/nluzardoV/sistema-prestamos-pedro
cd sistema-prestamos-pedro
cp .env.example .env   # configura tu base de datos
npm install
npm run start:dev
```

## Autor
Nerio Luzardo · [LinkedIn](https://www.linkedin.com/in/nerio-luzardo-316549397)
