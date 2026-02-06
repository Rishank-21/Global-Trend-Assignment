# Client Folder Structure

```
client/
├── pages/                           # HTML pages (served by server)
│   ├── index.html                  # Home page (redirects to login)
│   ├── login.html                  # Login page
│   ├── register.html               # Register page
│   └── dashboard.html              # Main dashboard/task page
│
├── assets/                         # All static assets
│   ├── js/                         # JavaScript source files
│   │   ├── config.js               # Configuration management
│   │   ├── utils/                  # Utility functions
│   │   │   ├── api.js              # API helper functions
│   │   │   ├── toast.js            # Toast notification utility
│   │   │   └── helpers.js          # General utility functions
│   │   ├── services/               # Business logic services
│   │   │   ├── authService.js      # Authentication API calls
│   │   │   └── taskService.js      # Task API calls
│   │   ├── pages/                  # Page-specific logic
│   │   │   ├── login.js            # Login page handler
│   │   │   ├── register.js         # Register page handler
│   │   │   └── dashboard.js        # Dashboard page handler
│   │   └── (old files)             # Legacy files (can be deleted)
│   │       ├── auth.js
│   │       └── tasks.js
│   │
│   ├── css/                        # Stylesheets
│   │   ├── app.css                 # Main/shared styles, dashboard styles
│   │   ├── register.css            # Register & login form styles
│   │   ├── login.css               # Login styles (inherits from register)
│   │   └── (old folder)            # Legacy CSS (can be deleted)
│   │
│   ├── images/                     # Image assets (if needed)
│   │
│   └── (other static assets)
│
├── public/                         # Public static files
│
└── (old structure)                 # Legacy files (to be cleaned up)
    ├── css/                        # Old CSS files
    ├── html/                       # Old HTML folder (empty)
    ├── js/                         # Old JS files
    ├── index.html
    ├── login.html
    ├── register.html
    └── dashboard.html
```

## File Descriptions

### Entry Points (`pages/`)

- **index.html** - Home page that redirects to login
- **login.html** - Login form with authentication
- **register.html** - Registration form for new users
- **dashboard.html** - Task manager dashboard

### Configuration (`assets/js/config.js`)

- Manages backend URL fetching from the server
- Caches the URL to avoid repeated requests
- Provides fallback for development environment

### Utilities (`assets/js/utils/`)

- **api.js** - API helper functions for fetch operations
- **toast.js** - Toast notification system
- **helpers.js** - Email validation, HTML escaping, authentication page checking

### Services (`assets/js/services/`)

- **authService.js** - Handles authentication logic (login, register, logout, token management)
- **taskService.js** - Handles all task operations (fetch, create, update, delete)

### Page Logic (`assets/js/pages/`)

- **login.js** - Login form submission and validation
- **register.js** - Registration form submission and validation
- **dashboard.js** - Dashboard initialization, task CRUD operations, modal management

### Styles (`assets/css/`)

- **app.css** - Global styles, dashboard styles, modal styles, task cards
- **register.css** - Form styles for login and register pages
- **login.css** - Login-specific styles (if needed)

## Architecture Overview

### Separation of Concerns

- **Pages** - Pure HTML files for routing
- **Services** - API communication layer
- **Utils** - Reusable helper functions
- **Page Modules** - Page-specific business logic and DOM manipulation

### Data Flow

```
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
