# Client Folder Structure

## Current Clean Structure

```
client/
├── index.html                      # Home page (root - redirects to login)
├── 
├── pages/                          # HTML entry pages (modular)
│   ├── login.html                  # Login page
│   ├── register.html               # Registration page
│   └── dashboard.html              # Task dashboard page
│
├── assets/                         # All static assets
│   ├── css/                        # Stylesheets
│   │   ├── app.css                 # Dashboard & shared styles
│   │   ├── register.css            # Login/Register form styles
│   │   └── login.css               # Login-specific styles
│   │
│   ├── js/                         # JavaScript modules
│   │   ├── config.js               # Backend URL configuration
│   │   │
│   │   ├── utils/                  # Reusable utilities
│   │   │   ├── api.js              # API request helpers
│   │   │   ├── toast.js            # Toast notifications
│   │   │   └── helpers.js          # Email validation, HTML escaping, etc.
│   │   │
│   │   ├── services/               # API & business logic
│   │   │   ├── authService.js      # Auth operations (login, register, logout)
│   │   │   └── taskService.js      # Task operations (CRUD)
│   │   │
│   │   └── pages/                  # Page-specific logic
│   │       ├── login.js            # Login form handler
│   │       ├── register.js         # Register form handler
│   │       └── dashboard.js        # Dashboard handler & task management
│   │
│   └── images/                     # Image assets (for future use)
│
├── public/                         # Public static files
│
└── STRUCTURE.md                    # This file
```

## Quick Reference

| File/Folder | Purpose |
|-------------|---------|
| `index.html` | Root home page (redirects to login) |
| `pages/*.html` | Modular page entry points |
| `assets/css/` | All stylesheets |
| `assets/js/config.js` | Backend URL management |
| `assets/js/utils/` | Reusable helper functions |
| `assets/js/services/` | API communication & business logic |
| `assets/js/pages/` | Page-specific initialization & DOM logic |

## Routing Overview

| Route | File Served |
|-------|-------------|
| `/` | `client/index.html` |
| `/login` | `pages/login.html` |
| `/register` | `pages/register.html` |
| `/dashboard` | `pages/dashboard.html` |
| `/assets/*` | Static assets (CSS, JS, images) |

## Module Relationships

```
pages/login.html
    ↓
assets/js/pages/login.js
    ↓
assets/js/services/authService.js
    ↓
assets/js/utils/api.js
    ↓
Backend API
```

## Key Principles

### 1. **Separation of Concerns**
- **HTML Pages** - Pure markup, routing entry points
- **Services** - Business logic & API communication only
- **Utils** - Reusable helper functions
- **Page Modules** - Event handling & DOM manipulation
- **Styles** - Component/page specific CSS

### 2. **Module Pattern**
- Each module exports specific functions
- Services wait for backend URL initialization
- No global state or side effects in modules

### 3. **Clean Routing**
- Single `index.html` at root (redirects to login)
- Separate pages in `pages/` folder
- Server handles all routing

## File Descriptions

### Entry Points
- **`pages/login.html`** - Login form page
- **`pages/register.html`** - Registration form page
- **`pages/dashboard.html`** - Main task management dashboard

### Configuration
- **`config.js`** - Fetches and caches backend URL from `/api/config`

### Services
- **`authService.js`** - Authentication API calls and token management
- **`taskService.js`** - Task CRUD operations

### Utilities
- **`api.js`** - HTTP request helpers
- **`toast.js`** - Toast notification system
- **`helpers.js`** - Validation and utility functions

### Page Logic
- **`login.js`** - Login form submission and validation
- **`register.js`** - Registration form submission and validation
- **`dashboard.js`** - Dashboard initialization, task management, modal handling

## Architecture Flow

```
User Action
    ↓
Page Module (DOM Event)
    ↓
Service Module (API Logic)
    ↓
Utility Module (HTTP Request)
    ↓
Backend Server
    ↓
Response ← Utility ← Service ← Page ← UI Update
```

## Development Notes

### Adding New Features
1. Create service function in respective service file
2. Import and use in page module
3. Call service function from page event handler

### Adding New Page
1. Create new HTML in `pages/`
2. Create new JS module in `pages/` folder
3. Add route in `server/index.js`
4. Add CSS in `assets/css/` if needed

### Backend Configuration
- Backend URL stored in `server/.env` as `BACKEND_URL`
- Frontend fetches via `/api/config` endpoint
- Automatically handled by `config.js`
HTML Form
    ↓
Page Module (e.g., login.js)
    ↓
Service (e.g., authService.js)
    ↓
Utility - API (api.js)
    ↓
Backend API
```

### Init Pattern

Each page module exports an `init{PageName}()` function:

```javascript
// Called from HTML script:
import { initLoginPage } from "../assets/js/pages/login.js";
initLoginPage();
```

## Key Features

### Security

- Backend URL stored in server environment variable
- Tokens stored in localStorage (can be upgraded to secure cookies)
- Authorization headers sent with authenticated requests
- CORS handled by backend

### Error Handling

- Toast notifications for user feedback
- Comprehensive error messages
- Network error fallbacks

### Responsive Design

- Mobile-friendly forms and layouts
- Adaptive grid for task cards
- Responsive CSS media queries

## Cleanup (Optional)

The following legacy files can be deleted once this new structure is verified working:

- `/client/css/` (old CSS)
- `/client/html/` (empty folder)
- `/client/js/` (old auth.js, tasks.js, config.js)
- `/client/*.html` (old pages in root)

## Running the Application

1. Ensure backend is running at the configured URL
2. Ensure `.env` file has correct `BACKEND_URL`
3. Open browser to `http://localhost:3000` (or deployed URL)
4. All pages will be served from the `pages/` directory
