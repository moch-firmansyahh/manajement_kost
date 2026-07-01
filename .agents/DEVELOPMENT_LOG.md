# Development Log

## 2026-06-29

- **Project Restructuring & Setup**:
  - Moved `app`, `components`, and `lib` to a new `src` directory to comply with `AGENTS.md` project structure requirements.
  - Created `src/hooks` and `src/types` directories.
  - Updated `tsconfig.json` paths to map `@/*` to `./src/*`.
  - Updated `components.json` CSS path to `src/app/globals.css`.

- **Type Definitions**:
  - Created `src/types/index.ts` with all required interfaces.
- **State Management (Custom Hooks)**:
  - Created `useKamar.ts` with dummy data and CRUD functions.
  - Created `usePenghuni.ts` with dummy data and CRUD functions.
  - Created `usePembayaran.ts` with dummy data and CRUD functions.
- **Layout & UI Components**:
  - Added Shadcn UI components: Button, Input, Table, Dialog, Badge, Card, Select, Label, Form.
  - Created layout components: `Sidebar.tsx` and `Navbar.tsx`.
  - Updated `src/app/layout.tsx` to include the global layout with Sidebar and Navbar.
- **Feature Implementation: Dashboard**:
  - Created `StatCard.tsx` for displaying key metrics.
  - Updated `src/app/page.tsx` to display total kamar, terisi, kosong, and pendapatan, along with recent residents and unpaid bills.
  - Added formatting utilities (`formatRupiah`, `formatDate`) to `src/lib/utils.ts`.
- **Feature Implementation: Kamar**:
  - Created components: `KamarTable.tsx`, `KamarForm.tsx`, `KamarBadge.tsx`.
  - Implemented `src/app/kamar/page.tsx` with filtering and CRUD integration.
  - Implemented `src/app/kamar/[id]/page.tsx` to display details, riwayat penghuni, and riwayat pembayaran.
- **Feature Implementation: Penghuni**:
  - Created components: `PenghuniTable.tsx`, `PenghuniForm.tsx`.
  - Implemented `src/app/penghuni/page.tsx` with search by name and CRUD.
  - Implemented `src/app/penghuni/[id]/page.tsx` to show details, current room info, and payment history.
- **Feature Implementation: Pembayaran**:
  - Created components: `PembayaranTable.tsx`, `PembayaranForm.tsx`, `StatusBadge.tsx`.
  - Implemented `src/app/pembayaran/page.tsx` with filtering by status and CRUD.
  - Implemented `src/app/pembayaran/[id]/page.tsx` to display details tagihan, penghuni, and kamar.
- **Optimization & Theming**:
  - Installed `next-themes` and wrapped the app with `ThemeProvider`.
  - Added a toggle button in `Navbar.tsx` for Dark/Light mode.
  - Refactored all hardcoded colors (`bg-white`, `text-gray-900`, etc.) to semantic Shadcn variables (`bg-background`, `text-foreground`, `bg-card`).
  - Removed excessive `animate-in` classes to fix navigation lag issues.
  - Implemented Client Layout Wrapper to conditionally render Sidebar and Navbar.
- **Feature Implementation: Auth & Profile**:
  - Created `src/app/login/page.tsx` with a static dummy authentication (admin@kost.com).
  - Created `src/app/profile/page.tsx` for Admin Profile UI.
  - Implemented Sidebar toggle functionality (hamburger menu).
