# MentorUnion — full-stack

React + Vite frontend, Express + Mongoose backend, MongoDB persistence.

## Layout

```
mentorunion-app/
├── server/            Express API (port 4000)
│   ├── src/
│   │   ├── index.js   Server entry
│   │   ├── seed.js    Seeds 8 collections from the original mock data
│   │   ├── models/    Mongoose schemas
│   │   └── routes/    Generic CRUD router
│   └── .env           MONGODB_URI + PORT
└── client/            Vite React app (port 5173)
    └── src/
        ├── App.jsx    The full dashboard (14k+ lines, MongoDB-backed)
        ├── api.js     Tiny REST client
        └── main.jsx
```

## Setup

### 1. MongoDB

Pick one:

- **Local** — install MongoDB Community, start `mongod`. The default `mongodb://localhost:27017/mentorunion` works out of the box.
- **Atlas (recommended for zero install)** — create a free cluster at https://cloud.mongodb.com, get the connection URI, and edit `server/.env`:
  ```
  MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/mentorunion?retryWrites=true&w=majority
  ```

### 2. Seed the database

```powershell
cd server
npm run seed
```

This populates 8 collections: `orgs`, `mentors`, `mentees`, `users`, `tickets`, `invoices`, `payouts`, `auditlogs` (~190 docs total).

### 3. Run the server

```powershell
cd server
npm run dev
```

Listens on `http://localhost:4000`. Health check: `http://localhost:4000/api/health`.

### 4. Run the client

In a second terminal:

```powershell
cd client
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api/*` to the Express server.

## What's MongoDB-backed

8 collections with full CRUD via `/api/<resource>`:

| Resource     | UI surfaces                                              |
| ------------ | -------------------------------------------------------- |
| `orgs`       | Organisations table, Onboard Org flow, Suspend/Reactivate |
| `mentors`    | Mentor pool, Add Mentor flow                             |
| `mentees`    | Mentees table, Mentee flows                              |
| `users`      | Users & access                                           |
| `tickets`    | Support queue                                            |
| `invoices`   | Credits & billing → Invoices                             |
| `payouts`    | Credits & billing → Payouts                              |
| `auditlog`   | Audit log (every action engine event POSTs here)         |

Other datasets (policies, feature flags, integrations, logic controllers, marketplace cues, visual library, etc.) remain as in-file seed since they're configuration/reference rather than runtime data.

## Verify it works

1. Load http://localhost:5173 — footer says **● MongoDB connected**.
2. Open the Organisations table — rows come from Mongo.
3. Click **+ Onboard Organisation**, fill the form, submit. Refresh → org persists.
4. Suspend an org — refresh → status persists.
5. `curl http://localhost:4000/api/orgs | jq length` → matches the visible row count.
6. Open Action Log drawer → entries are also written to `auditlogs` collection.

If the API is down the footer says **○ DB offline (using seed data)** and the UI keeps working with the in-memory mock data.

## API surface

- `GET    /api/<resource>` — list, supports `?q=&limit=&skip=&sort=`
- `GET    /api/<resource>/:id`
- `POST   /api/<resource>`
- `PATCH  /api/<resource>/:id`
- `PUT    /api/<resource>/:id`
- `DELETE /api/<resource>/:id`
- `POST   /api/audit` — append-only audit entry
- `GET    /api/health` — `{ ok, db, time }`

## Notes

- No authentication — the persona switcher in the header is purely client-side. Add real auth later (the `/api/users` collection is ready to back it).
- PowerShell users: `npm` works as `npm.cmd`. The dev scripts here use Vite/node directly so it's transparent.
- The original `mentorunion-dashboard (1).jsx` lives at `client/src/App.jsx` with surgical edits — see the `useActionEngine` hook for the API integration.
