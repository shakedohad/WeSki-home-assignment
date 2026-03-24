# WeSki Fullstack Assignment

This workspace contains:

- `weski-api` — Node.js/TypeScript API (Express + SSE)
- `weski-hotels-app` — React/TypeScript client (Vite)

## Prerequisites

- Node.js 18+ (recommended: 20+)
- npm

## 1) Install dependencies

From the workspace root:

1. Install API dependencies:
   - `cd weski-api && npm install`
2. Install client dependencies:
   - `cd ../weski-hotels-app && npm install`

## 2) Run the API server

In one terminal:

- `cd weski-api`
- `npm run dev`

The API runs on:

- `http://localhost:3001`
- Search endpoint: `POST /api/search`

## 3) Run the client app

In a second terminal:

- `cd weski-hotels-app`
- `npm run dev`

The client runs on:

- `http://localhost:5173`

> The Vite dev server proxies `/api` requests to `http://localhost:3001`.

## Optional environment variables (API)

In `weski-api`, you can set:

- `HOTELS_SIMULATOR_API_URL`
- `HOTELS_SIMULATOR_TIMEOUT_MS`
- `HOTELS_SIMULATOR_CURRENCY`
- `HOTELS_SIMULATOR_ADDITIONAL_GROUP_SIZE_OFFSET`

If not set, defaults from the code are used.

### Additional group size offset

The supplier supports expanding the original `group_size` search so the app can also
return larger room options.

- `HOTELS_SIMULATOR_ADDITIONAL_GROUP_SIZE_OFFSET` defines how many extra group sizes to include
- the search always starts from the original requested `group_size`
- the expanded maximum is capped at `10`

Examples:

- requested `group_size=2`, offset `=2` → queries `2`, `3`, `4`
- requested `group_size=4`, offset `=1` → queries `4`, `5`
- requested `group_size=9`, offset `=3` → queries `9`, `10`

If not set, the current default offset is `2`.

## Build commands

### API

- `cd weski-api`
- `npm run build`
- `npm start`

### Client

- `cd weski-hotels-app`
- `npm run build`
- `npm run preview`
