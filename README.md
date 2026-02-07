# Task Management Web App

Full-stack Task Management application with JWT authentication, built for the Full Stack Development Internship assessment.

## Summary

- **Frontend:** Static HTML/CSS/JS in `client/` (responsive UI, login/register, dashboard)
- **Backend:** Node.js + Express in `server/` with REST API and MongoDB integration
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT-based authentication (login/register/logout) with protected task routes
- **CORS:** Enabled for cross-origin requests between Vercel frontend and Render backend
- **Deployment:** Backend on Render, frontend on Vercel

## Quick Setup (Local Development)

### Backend

1. Install dependencies and set up environment:

```bash
cd server
npm install
```

2. Create `.env` file in `server/`:

```
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>
JWT_SECRET=your-secret-key
BACKEND_URL=http://localhost:3000
```

3. Start the server:

```bash
npm run dev
```

### Frontend

1. Open in a local dev server or browser:

```bash
# Option 1: Using http-server
cd client
npx http-server -p 8080

# Option 2: Direct file access
# Open client/login.html in browser
```

Access: `http://localhost:8080/login.html`

## Project Structure

```
client/
├── index.html, login.html, register.html, dashboard.html
├── assets/
│   ├── css/
│   │   ├── app.css           # Main dashboard styles
│   │   └── register.css      # Auth page styles (login & register)
│   ├── js/
│   │   ├── config.js         # Backend URL configuration
│   │   ├── pages/
│   │   │   ├── login.js      # Login page logic
│   │   │   ├── register.js   # Register page logic
│   │   │   └── dashboard.js  # Dashboard & task management
│   │   ├── services/
│   │   │   ├── authService.js    # Auth API calls
│   │   │   └── taskService.js    # Task API calls
│   │   └── utils/
│   │       ├── api.js        # Fetch helpers
│   │       ├── helpers.js    # Utility functions
│   │       └── toast.js      # Toast notifications

server/
├── index.js                   # Express app with CORS
├── package.json
├── config/
│   ├── db.js                 # MongoDB connection
│   └── token.js              # JWT utilities
├── controllers/
│   ├── authController.js     # Register/login/logout logic
│   └── taskController.js     # Task CRUD operations
├── middlewares/
│   └── authMiddleware.js     # JWT verification
├── model/
│   ├── Auth.js               # User schema
│   └── Task.js               # Task schema
└── routes/
    ├── authRoutes.js         # Auth endpoints
    └── taskRoutes.js         # Task endpoints
```

## API Endpoints

All endpoints are hosted at `https://global-trend-assignment.onrender.com` (production).

### Authentication

- `POST /api/auth/register` — Register new user
  - Body: `{ username, email, password }`
  - Returns: `{ token }`

- `POST /api/auth/login` — Login user
  - Body: `{ email, password }`
  - Returns: `{ token }`

- `POST /api/auth/logout` — Logout (clears session)

### Tasks (all require JWT authorization)

- `POST /api/tasks` — Create task
  - Header: `Authorization: Bearer <token>`
  - Body: `{ title, description }`
  - Returns: `{ _id, title, description, status, createdAt }`

- `GET /api/tasks` — Fetch all user tasks
  - Header: `Authorization: Bearer <token>`
  - Returns: `[{ _id, title, description, status, ... }]`

- `PUT /api/tasks/:id` — Update task
  - Header: `Authorization: Bearer <token>`
  - Body: `{ title?, description?, status? }` (all optional)
  - Returns: `{ _id, title, description, status, ... }`

- `DELETE /api/tasks/:id` — Delete task
  - Header: `Authorization: Bearer <token>`
  - Returns: `{ message: "Task deleted" }`

### Configuration Endpoint

- `GET /api/config` — Get backend URL (for frontend config)
  - Returns: `{ backendUrl: "https://global-trend-assignment.onrender.com" }`

## Authentication Flow

1. **Register/Login:** Frontend sends credentials to `/api/auth/register` or `/api/auth/login`
2. **Token Response:** Backend returns JWT token
3. **Store Token:** Frontend saves token in `localStorage`
4. **Protected Requests:** Frontend sends token in `Authorization: Bearer <token>` header for all task requests
5. **Logout:** Frontend clears localStorage and redirects to login page

## Frontend Configuration

The frontend automatically detects the environment:

- **Local:** Detects `localhost` → uses `http://localhost:3000`
- **Production:** Uses deployed backend URL from `config.js`

Update `client/assets/js/config.js` to change the backend URL for different deployments.

## Testing the App

1. **Register:** Visit `/register.html`, create a new account
2. **Login:** Visit `/login.html`, enter credentials
3. **Dashboard:** After login, redirect to `/dashboard.html`
4. **Tasks:**
   - Create: Fill title and description, click "+ Add Task"
   - Edit: Click "✏️ Edit" button on any task card
   - Delete: Click "🗑️ Delete" button on any task card
5. **Logout:** Click "Logout" button in header to return to login

## Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Connect GitHub repository
4. Set environment variables in Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Strong secret key
   - `BACKEND_URL`: Your Render app URL (e.g., `https://global-trend-assignment.onrender.com`)
5. Deploy

### Frontend (Vercel)

1. Push code to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Set build settings:
   - Framework: None (static)
   - Root Directory: `client`
4. Deploy
5. Vercel will auto-redeploy on each GitHub push

### Live URLs

- **Frontend:** https://global-trend-assignment-sigma.vercel.app
- **Backend:** https://global-trend-assignment.onrender.com

## CORS Configuration

The backend is configured to accept requests from:

- `http://localhost:3000`, `http://localhost:8080`, `http://localhost:5173` (local dev)
- `https://global-trend-assignment-sigma.vercel.app` (production frontend)
- `https://global-trend-assignment.vercel.app` (alternative frontend URL)

See `server/index.js` for CORS configuration.

## Security Notes

- JWT tokens are stored in `localStorage` (client-side)
- Tokens are sent in `Authorization: Bearer <token>` header
- All task routes are protected with `authMiddleware`
- Passwords are hashed with `bcryptjs` before storage
- CORS is restricted to known origins

## Improvements (Recommended for Production)

- [ ] Use `httpOnly` cookies instead of `localStorage` for JWT storage
- [ ] Add server-side input validation and sanitization
- [ ] Add rate limiting to auth endpoints
- [ ] Add error logging and monitoring
- [ ] Add unit and integration tests (Jest + Supertest)
- [ ] Add e2e tests (Cypress)
- [ ] Implement refresh token rotation
- [ ] Add password reset functionality
- [ ] Add email verification
- [ ] Use environment-specific configuration files

## Troubleshooting

### 404 on pages without `.html` extension

- All routes require `.html` extension (e.g., `/login.html` not `/login`)
- Redirects in JS files use full paths like `/dashboard.html`

### CORS errors in browser console

- Ensure backend is deployed and CORS is enabled in `server/index.js`
- Check that frontend URL is whitelisted in CORS origins
- For local testing, use `localhost` for both frontend and backend

### "Failed to fetch" errors

- Verify backend is running and accessible at the configured URL
- Check `config.js` for correct backend URL
- Ensure network requests are not blocked by firewall/proxy

## Submission

1. Commit all changes to GitHub
2. Include this README with deployment URLs
3. Ensure both frontend and backend are deployed and working
