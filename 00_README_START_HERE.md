# The Pizza Wave — Prototype Blueprint

This folder is the frozen source of truth for the client-pitch prototype.

## Goal
Build a fake-data prototype that feels production-ready and demonstrates the complete Pizza Wave ecosystem:
- `/` marketing landing
- `/app` customer PWA
- `/owner` founder control center
- `/kds` chef KDS
- `/team` reserved for future staff
- `/api/v1/*` future FastAPI namespace

## Prototype stack
React 19, Vite 8, TypeScript, React Router v7, Tailwind CSS v4, Framer Motion, Lucide React, Axios, TanStack Query, Zustand, React Hook Form, Zod, Dexie/IndexedDB, MSW, vite-plugin-pwa/Workbox.

Future backend: FastAPI, Pydantic, SQLAlchemy 2, Alembic, PostgreSQL, Redis, workers, WebSockets, PhonePe, WhatsApp Business Platform.

## Most important implementation rule
Never hardcode business data inside screens.

Use:
```text
UI
→ Query/Store
→ typed API client
→ MSW mock API
→ future FastAPI API
```

The frontend must not know whether the data source is mocked or real.

## Demo completion path
1. Customer opens `/app`.
2. Selects Delivery or Pickup.
3. Browses real-looking menu.
4. Customizes food.
5. Adds to cart.
6. Logs in using fake WhatsApp OTP.
7. Sees points/tier.
8. Uses fake PhonePe checkout.
9. Backend-shaped mock confirms payment.
10. Order enters `AWAITING_ACCEPTANCE`.
11. Owner accepts or system auto-accepts.
12. Accepted order appears in `/kds`.
13. Chef starts prep and may change timing.
14. Customer tracking updates immediately.
15. Chef marks ready.
16. Order completes.
17. Points become available.
18. CRM/tier progress updates.
19. Customer can use guided support/chat.
20. Returning in-store customer can be linked through My Wave ID or phone+OTP.

## Prototype boundary
Do not connect real PhonePe, WhatsApp, SMS, or customer data. Do not create real refunds. The goal is a production-shaped prototype.
