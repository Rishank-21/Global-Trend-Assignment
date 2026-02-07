import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

// CORS middleware - allow requests from Vercel frontend and localhost
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:5173",
  "https://global-trend-assignment-sigma.vercel.app",
  "https://global-trend-assignment.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Config endpoint - expose backend URL to frontend
app.get("/api/config", (req, res) => {
  res.json({
    backendUrl: process.env.BACKEND_URL || `http://localhost:${port}`
  });
});

// Serve frontend static assets
const clientPath = path.resolve(process.cwd(), "..", "client");
const assetsPath = path.join(clientPath, "assets");
const pagesPath = clientPath;

// Serve static assets (css, js, images, etc.)
app.use("/assets", express.static(assetsPath));
app.use(express.static(path.join(clientPath, "public")));
app.use(express.static(clientPath)); // Serve root level static files

// Route handlers for main pages
app.get("/", (req, res) => res.sendFile(path.join(clientPath, "index.html")));
app.get("/login", (req, res) =>
  res.sendFile(path.join(pagesPath, "login.html")),
);
app.get("/register", (req, res) =>
  res.sendFile(path.join(pagesPath, "register.html")),
);
app.get("/dashboard", (req, res) =>
  res.sendFile(path.join(pagesPath, "dashboard.html")),
);
app.get("/dashboard.html", (req, res) =>
  res.sendFile(path.join(pagesPath, "dashboard.html")),
);

// Generic handler for `/<page>` to serve a matching HTML file if present
app.get("/:page", (req, res, next) => {
  const page = req.params.page;
  if (!page || page.includes(".")) return next();
  const file = path.join(pagesPath, `${page}.html`);
  if (fs.existsSync(file)) return res.sendFile(file);
  return next();
});

// SPA fallback: serve client/index.html for unknown routes
app.use((req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
