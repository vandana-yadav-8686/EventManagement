# Event Management Application

A full-stack conference event management application built for the **ConferenceTV technical assignment**. Users can create, view, edit, and delete events with speaker details, client- and server-side validation, optional AI-generated content (Google Gemini), and PDF export.

---

## Project Overview

This application provides a simple but complete event management workflow:

- **Create events** with event name, date, speaker name, and speaker designation (all required)
- **Dashboard** listing all events in a sortable table
- **View, edit, and delete** events with confirmation before delete
- **Validation** on both frontend and backend with clear error messages
- **Bonus:** AI-generated event description and speaker introduction (Gemini API)
- **Bonus:** Export event details as a PDF from the event detail page

The solution is intentionally focused: one entity (`Event`), one MongoDB collection, REST APIs, and a clean React UI — without unnecessary complexity.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | **Next.js 15** (App Router) | Full-stack React framework |
| Language | **TypeScript** | Type safety across frontend and backend |
| UI | **React 19**, **Tailwind CSS 4** | Components and styling |
| Backend | **Next.js API Routes** | REST CRUD endpoints |
| Database | **MongoDB Atlas** + **Mongoose** | Cloud document database |
| Validation | **Zod** | Shared validation rules (client + server) |
| AI (Bonus) | **Google Gemini API** | Event description & speaker intro |
| PDF (Bonus) | **jsPDF** | Client-side PDF export |

---

## Features

### Core Requirements
- Event creation form with required fields and inline validation
- Event date validation (valid date, cannot be in the past)
- Success feedback after creating an event
- Event dashboard (table view)
- View event details, edit any field, delete with confirmation
- Empty state when no events exist
- Loading states (dots loader) and error handling

### Bonus Features
- **AI content generation** — 2–3 paragraph event description + ~100 word speaker introduction
- **PDF export** — download event details from the detail page

### Performance & UX
- Client-side event cache for faster View/Edit navigation
- API warm-up on app load
- Prefetch on link hover
- Proper `error.tsx`, `not-found.tsx`, and `loading.tsx` pages

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── events/              # CRUD + AI generate endpoints
│   │   └── health/              # Database health check
│   ├── events/
│   │   ├── new/                 # Create event
│   │   └── [id]/                # View & edit event
│   ├── error.tsx                # Global error boundary
│   ├── not-found.tsx            # 404 page
│   └── loading.tsx              # Route loading UI
├── components/                  # Reusable UI components
├── context/
│   └── EventCacheContext.tsx    # Client-side event cache
└── lib/
    ├── validations/event.ts     # Zod schemas (single source of truth)
    ├── models/Event.ts          # Mongoose model
    ├── events-service.ts        # Database operations
    ├── db.ts                    # Cached MongoDB connection
    ├── gemini.ts                # Gemini AI integration
    ├── api-client.ts            # Frontend API helpers
    └── pdf-export.ts            # PDF generation
```

---

## Setup Instructions

### Prerequisites

- **Node.js 18+** and **npm**
- **MongoDB Atlas** account ([free tier](https://www.mongodb.com/cloud/atlas))
- **Google Gemini API key** ([Google AI Studio](https://aistudio.google.com/apikey)) — optional for core CRUD; required for AI features

### Step 1 — Clone and install

```bash
git clone <your-repository-url>
cd "Event Management application"
npm install
```

> **Note:** If the folder name contains spaces, that is fine. The npm package name in `package.json` is `event-management-app`.

### Step 2 — Environment variables

Copy the example file:

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Edit `.env` in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/eventmanagement?retryWrites=true&w=majority
GEMINI_API_KEY=your_full_api_key_here
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | No (for CRUD) | Full key from Google AI Studio (may start with `AIza...` or `AQ.`) |

**Do not commit `.env` to Git** — it is listed in `.gitignore`.

### Step 3 — MongoDB Atlas setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Database Access** → create a database user (username + password)
3. **Network Access** → add your IP address, or `0.0.0.0/0` for development
4. Click **Connect** → **Drivers** → copy the connection string
5. Replace `<password>` with your database user password
6. Set the database name to `eventmanagement` (or update the URI accordingly)

**Password tip:** If your password contains special characters (`!`, `@`, `#`), either URL-encode them (`!` → `%21`) or use a simple alphanumeric password for development. The app auto-encodes credentials in code.

### Step 4 — Verify database connection

```bash
npm run dev
```

Then open or request:

```
http://localhost:3000/api/health
```

Expected response:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "database": "connected",
    "timestamp": "..."
  }
}
```

### Step 5 — Run the application

**Development mode:**

```bash
npm run dev
```

If you see stale or broken pages after code changes:

```bash
npm run dev:clean
```

Open [http://localhost:3000](http://localhost:3000)

**Production mode (faster):**

```bash
npm run build
npm start
```

### Step 6 — Deploy (optional)

1. Push the repository to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables: `MONGODB_URI`, `GEMINI_API_KEY`
4. Deploy and add the live URL below

---

## Live Demo

_Add your deployment URL here after deploying to Vercel, e.g. `https://your-app.vercel.app`_

---

## API Reference

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/api/health` | Check database connection | 200, 503 |
| GET | `/api/events` | List all events | 200, 500 |
| POST | `/api/events` | Create event | 201, 400, 500 |
| GET | `/api/events/:id` | Get one event | 200, 400, 404, 500 |
| PUT | `/api/events/:id` | Update event | 200, 400, 404, 500 |
| DELETE | `/api/events/:id` | Delete event | 200, 400, 404, 500 |
| POST | `/api/events/generate` | AI content from form data | 200, 400, 429, 502, 503, 500 |
| POST | `/api/events/:id/generate` | AI content for saved event | 200, 400, 404, 429, 502, 503, 500 |

All API responses use a consistent shape:

```json
{ "success": true, "data": { ... } }
```

```json
{ "success": false, "message": "Error description", "errors": [{ "field": "eventName", "message": "..." }] }
```

---

## Example Event

| Field | Value |
|-------|-------|
| Event Name | Advances in Fetal Medicine |
| Event Date | 15 August 2026 |
| Speaker Name | Dr. Jane Smith |
| Speaker Designation | Senior Consultant, ABC Hospital |

---

## Assumptions

- Event dates must be **today or in the future**; past dates are rejected
- Dates are stored at midnight local time for consistent display
- Date formatting uses English locale (`en-IN`)
- **No authentication** — single-user scope as per assignment requirements
- Core CRUD works without `GEMINI_API_KEY`; AI generation shows an error if the key is missing or quota is exceeded (no fake content is generated)
- One MongoDB document per event; speaker name and designation are stored on the same document
- Free-tier Gemini API has rate limits shared per Google Cloud project (not per API key)

---

## AI Tools Used

| Tool | How It Was Used |
|------|-----------------|
| **Cursor (AI IDE)** | Project scaffolding, API routes, React components, validation logic, performance optimizations, and documentation |
| **Google Gemini API** | Runtime generation of event descriptions and speaker introductions (bonus feature) |

For a detailed breakdown of approach, challenges, and design decisions, see **[SOLUTION_NOTES.md](./SOLUTION_NOTES.md)**.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `bad auth` from MongoDB | Check username/password in Atlas; URL-encode special characters in password |
| `Database authentication failed` | Verify Network Access in Atlas allows your IP |
| Gemini quota exceeded | Wait and retry, enable billing in AI Studio, or use a new Google account/project |
| `missing required error components` | Run `npm run dev:clean`; stop all other `npm run dev` terminals |
| Slow pages in dev | Use `npm run build && npm start` for production-like speed |
| API key not working | Copy the **full** key via **Copy key** in AI Studio (include `AQ.` prefix if present) |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:clean` | Clear `.next` cache and start dev server |
| `npm run build` | Create production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

---

## License

MIT — built for ConferenceTV technical assessment purposes.
