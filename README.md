# Task Management Web App

Simple full-stack Task Management application built for the Full Stack Development Internship assessment.

## Summary

- Frontend: static HTML/CSS/JS in `client/` (responsive UI, login/register, dashboard)
- Backend: Node.js + Express in `server/` with REST API for auth and tasks
- Database: MongoDB (Mongoose)
- Auth: JWT-based (login/register/logout) with protected task routes

## Quick Setup

1. Install Node dependencies and start the server

```bash
cd server
npm install
npm run dev
```

2. Create a `.env` file inside `server/` with:

```
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-strong-secret>
PORT=3000
```

3. Open the app in your browser:

```
http://localhost:3000/
```

## Project Structure

- client/
  - login.html, register.html, dashboard.html
  - css/: styles (register.css, app.css)
  - js/: `auth.js`, `tasks.js`
- server/
  - index.js (Express app)
  - routes/: `authRoutes.js`, `taskRoutes.js`
  - controllers/: business logic
  - model/: Mongoose models (`Auth`, `Task`)
  - config/: `db.js`, `token.js`

## API Endpoints

- Auth
  - POST `/api/auth/register` — register; body { username, email, password }
  - POST `/api/auth/login` — login; body { email, password }
  - POST `/api/auth/logout` — logout
  - GET `/api/auth/me` — get current user (protected)

- Tasks (protected)
  - POST `/api/tasks` — create task; body { title, description }
  - GET `/api/tasks` — list user's tasks
  - PUT `/api/tasks/:id` — update task; body { title?, description?, status? }
  - DELETE `/api/tasks/:id` — delete task

Auth note: the server sets a cookie on login and also returns a token. The frontend stores token in `localStorage` and sends it as `Authorization: Bearer <token>` with API requests.

## Testing the app

1. Register a new user at `/register`.
2. After registration you will be redirected to the dashboard to add tasks.
3. Create, update (Edit), and delete tasks.

## Improvements (recommended for production)

- Use `httpOnly` cookie-only session handling (avoid `localStorage` for JWT).
- Add server-side and client-side input validation.
- Add unit/integration tests (Jest + Supertest) and basic e2e tests.
- Deploy to Render/Heroku/Vercel and use a managed MongoDB (Atlas).

## Submission

- Commit the repository, push to GitHub, and include this README. Optionally deploy and include the live URL.

---

If you want, I can: convert the frontend to cookie-only auth, add `README` screenshots, or create a GitHub-ready release. Tell me which to do next.
