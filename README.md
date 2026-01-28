This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
## 🚀 Cómo correr el proyecto localmente

### Requisitos
- Node.js ≥ 18
- npm o pnpm

### Pasos

```bash
npm install
npm run dev


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

🧠 Decisiones de Producto

Durante la prueba prioricé calidad de experiencia y arquitectura sobre cantidad de features.

1. Enfoque en priorización clara

Implementé un score compuesto (Impact × 2 + Priority − Effort) para ordenar los ítems.
El objetivo fue que el usuario entienda rápidamente qué atender primero, no solo listar datos.

2. UX primero

KPIs visibles arriba para contexto inmediato.
Top 5 Priorities destacado para toma rápida de decisiones.
Filtros simples y combinables (texto, estado, prioridad, tags).
Estados claros: loading, error y empty.


3. Arquitectura limpia

Separación clara entre:
domain (tipos, reglas, score)
hooks (estado y lógica)
components (UI)
Evité lógica de negocio dentro de componentes de presentación.

⚖️ Tradeoffs (qué dejé fuera por tiempo)

Por limitación de tiempo decidí no implementar:
Persistencia real en backend (se simula con estado/local logic).
Autenticación de usuarios.
Tests automatizados (Jest / Playwright).
Internacionalización (i18n).
Animaciones complejas con librerías externas (Framer Motion).
Optimización avanzada de rendimiento (virtualización de listas).
Dark / Light Mode


