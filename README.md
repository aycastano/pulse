This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:


### Requiriment
- Node.js ≥ 18
- npm o pnpm

### Step

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

🧠 Product Decisions

During the technical test, I prioritized experience quality and architecture over the number of features.
1. Focus on clear prioritization
I implemented a composite score (Impact × 2 + Priority − Effort) to rank items.
The goal was to help users quickly understand what to tackle first, rather than just displaying data.

2. UX First

Key KPIs displayed at the top for immediate context.
Top 5 Priorities highlighted to enable fast decision-making.
Simple, combinable filters (text, status, priority, tags).
Clear states: loading, error, and empty.

3. Clean Architecture

Clear separation between:
domain (types, business rules, scoring logic)
hooks (state management and application logic)
components (UI)
Business logic is intentionally kept out of presentational components.

Trade-offs (What I intentionally left out due to time constraints)

Due to time limitations, I intentionally did not implement:
Real backend persistence (simulated with local state and in-memory logic).
User authentication.
Automated testing (Jest / Playwright).
Internationalization (i18n).
Advanced animations using external libraries (e.g. Framer Motion).
Advanced performance optimizations (e.g. list virtualization).
Dark / Light mode support.


