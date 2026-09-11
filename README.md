# FootwearMS

FootwearMS is a browser-based footwear inventory, purchasing, sales, customer, and billing management prototype.

## Core features

- Dashboard totals for products, stock, sales, revenue, partners, and low-stock alerts.
- Product, manufacturer, customer, purchase, and sale management screens.
- Inventory adjustments, receiving workflows, sales returns, invoices, and payment recording.
- Reports and charts for sales, revenue, inventory, and customers.
- PDF document generation and JSON backup/restore utilities.
- Responsive navigation and light/dark theme support.
- Browser-local persistence; records are stored in the user's browser rather than a remote database.

## Technology stack

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS 4
- Zustand for application state
- Browser `localStorage` persistence
- Chart.js and jsPDF
- React Hook Form, Zod, and date-fns

## Prerequisites

- Node.js compatible with the locked dependencies
- npm

## Local setup

```bash
git clone https://github.com/varunisrani/footwearms.git
cd footwearms
npm ci
npm run dev
```

Production build and start commands:

```bash
npm run build
npm run start
```

Lint the project with `npm run lint`.

## Configuration

No environment variables are referenced by the current application. Data is initialized and retained in browser storage.

## Project structure

- `app/` — App Router pages for the dashboard and management workflows
- `components/` — forms, tables, charts, layout, and reusable UI components
- `lib/services/` — local storage and document-generation services
- `lib/stores/` — Zustand application store
- `lib/types/` — domain and storage types
- `public/` — static assets
- `footwearms/` — an additional tracked copy of an earlier application tree

## Status and limitations

This repository is a client-side prototype. It has no authentication, shared backend, or server-side persistence, so browser data is not synchronized between devices or users. The AI Agent route embeds an externally hosted ElevenLabs widget and requires network access. Review the duplicated `footwearms/` subtree before making changes so the intended application tree remains clear.
