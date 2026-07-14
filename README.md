# ♞ Chessmaster — Chess Tournament Management System

A production-ready admin dashboard for running chess tournaments: manage players, organize tournaments, register participants, generate random pairings, record results, and track rankings — all in one modern SaaS-style interface.

Built with **SvelteKit**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, and **Tailwind CSS**.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Database Setup](#database-setup)
7. [Prisma Migrations & Seeding](#prisma-migrations--seeding)
8. [Running the Project](#running-the-project)
9. [Folder Structure](#folder-structure)
10. [API Documentation](#api-documentation)
11. [Deployment](#deployment)
12. [Screenshots](#screenshots)
13. [Future Improvements](#future-improvements)

---

## Project Overview

Chessmaster gives a tournament administrator everything needed to run an event from start to finish:

- Maintain a roster of players with ratings, demographics, and contact info.
- Create tournaments with a location, date, status, and player cap.
- Register players into tournaments with duplicate and capacity checks.
- Randomly pair registered players into rounds (with automatic byes for odd counts).
- Record match results — either manually or via a one-click random "Generate Winner" action — updating each player's win/loss totals.
- View dynamically computed rankings (🥇🥈🥉), tournament-level statistics, and a dashboard summarizing the whole system.

---

## Features

- **Dashboard** — total players/tournaments/matches, active tournament, reigning champion, upcoming tournament, recent matches, top ranked players, and bar charts for matches-per-tournament and wins-per-player.
- **Admin Authentication** — email/password login backed by a signed JWT stored in an HTTP-only cookie; all `/  (app)` routes are protected server-side.
- **Player Management** — full CRUD, unique-email validation, search, country filter, sortable/paginated table, profile page with match history.
- **Tournament Management** — full CRUD, search, status filter, per-tournament detail page.
- **Registration** — multi-select checkbox picker with search, duplicate prevention, and maximum-player enforcement.
- **Random Match Generator** — Fisher–Yates shuffle + pairing algorithm; automatic bye for an odd player count; persists round number, players, and match time.
- **Match Results** — "Generate Winner" randomly resolves a decided match (or accepts an explicit winner), incrementing the winner's `wins` and the loser's `losses`.
- **Match History** — searchable, filterable (status, tournament), paginated log of every match ever played.
- **Rankings** — highest wins → higher rating → alphabetical tie-breaks, with gold/silver/bronze medals, both globally and per-tournament.
- **Tournament Statistics** — total/completed/remaining matches, average rating, highest/lowest rated player, tournament champion.
- **Modern, Responsive UI** — sidebar + navbar shell, light/dark theme, cards, tables, badges, modals, confirmation dialogs, pagination, toasts, skeleton/empty states, custom 404/500 pages.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Svelte 4, SvelteKit, TypeScript, Tailwind CSS |
| Backend | SvelteKit server routes (`+server.ts`), Prisma ORM |
| Database | PostgreSQL (Neon or Supabase recommended) |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` password hashing |
| Package manager | npm |
| Deployment | Vercel + Neon/Supabase PostgreSQL |

---

## Installation

```bash
git clone <your-repo-url> chessmaster
cd chessmaster
npm install
```

`npm install` also runs `prisma generate` automatically via the `postinstall` script.

---

## Configuration

Copy the example environment file and fill in your own values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon, Supabase, or local Postgres) |
| `JWT_SECRET` | Random secret used to sign admin session tokens — generate with `openssl rand -base64 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials created by the seed script |
| `APP_NAME` | Display name used around the app |
| `PORT` | Local dev server port |

---

## Database Setup

You can use any PostgreSQL provider. Two common options:

**Neon (recommended for Vercel deploys)**
1. Create a project at [neon.tech](https://neon.tech).
2. Copy the pooled connection string into `DATABASE_URL` in `.env`.

**Local PostgreSQL**
```bash
createdb chess_tournament
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chess_tournament?schema=public"
```

---

## Prisma Migrations & Seeding

Apply the schema to your database:

```bash
npx prisma migrate dev
```

This creates all tables (`admins`, `players`, `tournaments`, `tournament_players`, `matches`) from `prisma/schema.prisma` using the included migration in `prisma/migrations/20260101000000_init`.

Seed the database with a bootstrap admin, 20 players, 3 tournaments, random registrations, matches, and winners:

```bash
npm run prisma:seed
```

The seeded admin login is printed to the console (defaults to the `ADMIN_EMAIL` / `ADMIN_PASSWORD` in your `.env`).

Other useful Prisma commands:

```bash
npm run prisma:studio         # visual database browser
npm run prisma:migrate:deploy # apply migrations in production (no dev prompts)
```

---

## Running the Project

```bash
npm run dev       # start the dev server on http://localhost:5173
npm run build     # production build
npm run preview   # preview the production build locally
npm run check     # type-check the project
npm run lint      # lint with ESLint
```

Sign in at `/login` with your seeded admin credentials, then explore the Dashboard, Players, Tournaments, Matches, and Rankings pages.

---

## Folder Structure

```
chessmaster/
├── prisma/
│   ├── schema.prisma          # Player, Tournament, TournamentPlayer, Match, Admin models
│   ├── seed.ts                 # Seed script (players, tournaments, matches)
│   └── migrations/             # SQL migration history
├── src/
│   ├── app.html / app.css / app.d.ts / hooks.server.ts
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/             # Button, Modal, Input, Select, Table, Badge, Card,
│   │   │   │                   # Loader, Skeleton, Pagination, Toast, SearchBar,
│   │   │   │                   # ConfirmationDialog, EmptyState
│   │   │   ├── layout/         # Sidebar, Navbar
│   │   │   └── charts/         # BarChart (SVG-based, no external chart dependency)
│   │   ├── server/              # prisma client, auth (JWT), validation, dashboard & stats helpers
│   │   ├── stores/              # toast store, theme store
│   │   ├── types/                # shared TypeScript types
│   │   └── utils/                # formatting, ranking, match-pairing algorithms
│   └── routes/
│       ├── login/, logout/
│       ├── (app)/                # protected shell: dashboard, players, tournaments,
│       │                          # matches, rankings, settings
│       └── api/                  # REST endpoints (see below)
├── static/                        # favicon
├── .env.example
├── package.json
└── README.md
```

---

## API Documentation

All endpoints live under `/api` and return JSON. Protected pages call these from the browser; they can also be used by any external client once authenticated (session cookie).

### Players
| Method | Route | Description |
|---|---|---|
| GET | `/api/players?search=&country=&page=&pageSize=&sortKey=&sortDir=` | List players (search, filter, sort, paginate) |
| POST | `/api/players` | Create a player |
| GET | `/api/players/:id` | Get a player with tournaments & matches |
| PUT | `/api/players/:id` | Update a player |
| DELETE | `/api/players/:id` | Delete a player |

### Tournaments
| Method | Route | Description |
|---|---|---|
| GET | `/api/tournaments?search=&status=&page=&pageSize=` | List tournaments |
| POST | `/api/tournaments` | Create a tournament |
| GET | `/api/tournaments/:id` | Get a tournament with players & matches |
| PUT | `/api/tournaments/:id` | Update a tournament |
| DELETE | `/api/tournaments/:id` | Delete a tournament |

### Registration
| Method | Route | Description |
|---|---|---|
| POST | `/api/tournaments/:id/register` | Register one or more players (`{ playerIds: string[] }`) — enforces max players & duplicates |
| DELETE | `/api/tournaments/:id/register` | Remove a player (`{ playerId: string }`) |

### Matches
| Method | Route | Description |
|---|---|---|
| POST | `/api/tournaments/:id/matches/generate` | Shuffle registered players and generate the next round's pairings (bye if odd) |
| GET | `/api/tournaments/:id/matches` | List matches for a tournament |
| PUT | `/api/matches/:id/winner` | Decide a match — random winner by default, or pass `{ winnerId }` to set explicitly |

### Rankings & Statistics
| Method | Route | Description |
|---|---|---|
| GET | `/api/tournaments/:id/rankings` | Tournament-scoped standings (wins → rating → name) |
| GET | `/api/tournaments/:id/stats` | Tournament statistics (matches, average rating, champion, etc.) |
| GET | `/api/dashboard` | Aggregate dashboard data |

All write endpoints validate input server-side (`src/lib/server/validation.ts`) and return `{ message, errors }` with a `4xx` status on failure.

---

## Deployment

### Vercel + Neon

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Create a Neon (or Supabase) PostgreSQL database and copy its connection string.
3. In Vercel, import the repository and set these Environment Variables: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `APP_NAME`.
4. Build command: `npm run build` (the project already uses `@sveltejs/adapter-vercel`).
5. After the first deploy, run migrations against the production database once:
   ```bash
   DATABASE_URL="<your-prod-url>" npx prisma migrate deploy
   DATABASE_URL="<your-prod-url>" npm run prisma:seed   # optional, for demo data
   ```
6. Visit your Vercel URL and log in with the seeded admin credentials.

---

## Screenshots

> Replace these placeholders with real screenshots once the app is running locally.

- `docs/screenshots/dashboard.png` — Dashboard overview
- `docs/screenshots/players.png` — Player management table
- `docs/screenshots/tournament-detail.png` — Registration & match generation
- `docs/screenshots/rankings.png` — Rankings with medals

---

## Future Improvements

- Swiss-system or round-robin pairing modes (in addition to fully random pairing).
- Manual PGN/move entry per match, not just win/loss outcomes.
- Email notifications when a new round is generated.
- Role-based access (multiple admins with different permission levels).
- Export players/rankings to CSV/PDF.
- Automated test suite (Vitest + Playwright).

---

Built as a complete, end-to-end reference implementation of a chess tournament manager. Contributions and adaptations welcome.
