# ShelfX — Library Management & Book Discovery Platform

A full-stack library management and book discovery web app with a modern black-and-blue theme.

## Stack
- **Frontend:** React (Vite) + Tailwind CSS + React Router + Leaflet (OpenStreetMap)
- **Backend:** Node.js + Express.js + Sequelize ORM
- **Database:** PostgreSQL (MySQL also supported via Sequelize dialect swap)
- **Auth:** JWT (access + refresh tokens), bcrypt password hashing
- **Email:** Nodemailer (SMTP — works with Gmail, SendGrid, SES, Mailtrap, etc.)
- **Scheduled Jobs:** node-cron (due-date reminders, overdue checks, fine calculation)
- **Maps:** Leaflet + OpenStreetMap (no API key needed) with a Google Maps swap-in point

## Project layout

```
shelfx/
  backend/            Express API
    src/
      config/         DB connection, env config
      models/         Sequelize models (User, Book, Library, BorrowRecord, DigitalBook, RackSlot)
      controllers/     Route handlers / business logic
      routes/          Express routers
      middleware/      auth (JWT), role guard, error handler
      services/        email service, geolocation helper
      jobs/            cron scheduler (reminders, overdue, fines)
      utils/           token, date-math, async wrapper
    schema.sql         Raw SQL schema (alternative to Sequelize sync)
    .env.example
    package.json
  frontend/           React app
    src/
      pages/           Login, Register, Home, SearchResults, BookDetail,
                       Libraries, Profile, AdminDashboard, DigitalLibrary
      components/      Navbar, BookCard, LibraryMap, ProtectedRoute, etc.
      context/         AuthContext
      api/             axios instance
    tailwind.config.js
    package.json
```

## Quick start

### 1. Database
Create a Postgres database and run `backend/schema.sql`, OR just start the server —
Sequelize will auto-create tables on first run (`sequelize.sync()`).

```bash
createdb shelfx
psql shelfx < backend/schema.sql   # optional, if you prefer raw SQL
```

### 2. Backend

```bash
cd backend
cp .env.example .env    # fill in DB + JWT + SMTP credentials
npm install
npm run dev              # nodemon, http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

The frontend proxies `/api` calls to `http://localhost:5000` (see `vite.config.js`).

## Core features implemented

- Register/login (name, username, phone, email, password) with JWT auth
- Home page with rotating book quote + search bar (title/author)
- Book search results with availability, library, rack number, book number,
  and expected-availability date when checked out
- Library directory with locations, "libraries near me" (browser geolocation)
  and an interactive Leaflet map
- Profile/settings: edit profile, currently borrowed books, borrowing history,
  due dates, fines
- Borrowing flow: 10-day loan, automatic due date, cron-driven:
  - reminder email 1 day before due date
  - return confirmation email
  - overdue warning email
  - ₹200 late fine applied once per overdue book, with a detailed fine email
- Admin dashboard: CRUD for books, authors, racks, book numbers, availability,
  libraries, and a live view of who is holding which book, with manual
  inventory update support for libraries without an API/integration
- Digital library: search + "read online" links for legally available e-books

## Notes on scope

This is a complete, runnable reference implementation, sized to be read and
extended rather than to be an exhaustive enterprise system. Swap in
Google Maps by replacing `LibraryMap.jsx`'s Leaflet layer with
`@react-google-maps/api` and adding an API key (a comment in that file shows
exactly where).
