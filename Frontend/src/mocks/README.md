# Mock Data Layer

This project is currently configured to use in-memory mock data for portfolio/demo purposes.

## Toggle
Set `VITE_USE_MOCK=false` in an environment variable (e.g. `.env`) to force real API calls. Defaults to `true` when unset.

## Files
- `src/mocks/mockConfig.js` – helper (toggle + artificial latency)
- `src/mocks/data/clients.js`
- `src/mocks/data/employees.js`
- `src/mocks/data/incomingInvoices.js`
- `src/mocks/data/outgoingInvoices.js`

## Pattern
Each service first checks `isMockEnabled()`; if true returns mock data with a small simulated delay, otherwise falls back to the existing Axios API call.

No real API code was removed – safe for later backend integration.
