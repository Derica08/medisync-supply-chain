# Medisync

Medisync is an accessible medicine inventory and supply-chain demonstration. It includes a browser frontend and a small Node.js backend with a local JSON store. All medicines, people, shipments, suppliers, and actions are fictional demo records. It does not connect to pharmacies, patients, suppliers, barcode databases, SMS/WhatsApp, or live logistics.

## Run locally

Requirements: Node.js 20 or newer.

```sh
npm start
```

Open the local address printed by the server (default `http://127.0.0.1:4173`). The server serves both the website and `/api/*`; no database setup or package installation is required. Set `PORT` or `HOST` to change the local listener.

The demo state is written to `server/data/demo-state.json` and survives server restarts. Remove that file to reset manually, or call `POST /api/demo/reset` from a local API client. This is a local demo store, not production-grade database storage.

## Main demo flow

1. Enter in Demo mode as an Inventory Manager.
2. Open Amoxicillin’s risk explanation and inspect stock cover, delayed shipment, and the estimated gap before arrival.
3. Find backup suppliers; matching responds to the chosen quantity, distance, delivery-time, and reliability requirements.
4. Flag a supplier for follow-up; this does not place an order or contact anyone.
5. Review a batch trace, assign and acknowledge an alert, and see state persist after a reload.
6. Change to Patient or Caregiver for refill planning. Caregiver plan details remain hidden until the patient opts in. Refill plans are demo records and may remain awaiting professional approval.

## API

The same-origin JSON API is implemented in `server/index.js`. It covers dashboard, medicine and inventory records, batches and trace history, shipments, risks, alerts and ownership, supplier matching, analytics, settings, refill plans, and notification preferences. `GET /api/health` reports service status and `GET /api/bootstrap` loads the app’s seed records and saved demo state.

The frontend calls the API through `src/services.js`; the backend can be replaced behind this adapter. Records are currently seeded from `src/data.js`, and the risk model lives in `src/risk.js`.

## Demo limitations

Demo role selection is not authentication or authorization. The local JSON file has no production database guarantees. Camera barcode reading depends on browser support and recognizes only the listed sample barcodes. The voice feature is browser speech recognition where available. No real messages, orders, dispatches, supplier contact, clinical recommendations, or shipment tracking occur.

## Public demo deployment (Render)

A Render Blueprint is included in `render.yaml`. To publish it:

1. Push this project to a GitHub repository.
2. In Render, choose **New → Blueprint**, connect that repository, and deploy the detected `render.yaml`.
3. Wait for the deploy to pass its `/api/health` check. Render will show the public `onrender.com` address; use that generated address in your presentation.

The included free configuration is suitable for a hackathon demo, but it uses an ephemeral filesystem. Saved demo actions can reset after a restart or deploy. For saved data across restarts, upgrade to a plan that supports a persistent disk, attach it at `/var/data`, and set `MEDISYNC_DATA_DIR=/var/data`. A persistent disk is tied to one service instance and disables zero-downtime deploys. For a more durable multi-instance deployment, replace the JSON store with a managed database.
