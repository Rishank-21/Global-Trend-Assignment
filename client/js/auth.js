// handles login/register and storing token
const apiBase = "/api/auth";

// toast helper
function ensureToastContainer() {
  if (document.getElementById("toastContainer")) return;
  const c = document.createElement("div");
  c.id = "toastContainer";
  c.style.position = "fixed";
  c.style.top = "16px";
  c.style.right = "16px";
  c.style.zIndex = 9999;
  c.style.display = "flex";
  c.style.flexDirection = "column";
  c.style.gap = "8px";
  document.body.appendChild(c);
}

function showToast(message, type = "info") {
  ensureToastContainer();
  const el = document.createElement("div");
  el.textContent = message;
  el.style.padding = "10px 14px";
  el.style.borderRadius = "8px";
  el.style.color = "#fff";
  el.style.fontWeight = "600";
  el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
  el.style.maxWidth = "320px";
  if (type === "success") el.style.background = "#27ae60";
  else if (type === "error") el.style.background = "#e74c3c";
  else el.style.background = "#333";
  document.getElementById("toastContainer").appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json().then((data) => ({ status: res.status, data }));
}

export async function register(payload) {
  return await postJSON(apiBase + "/register", payload);
}

export async function login(payload) {
  return await postJSON(apiBase + "/login", payload);
}

export function saveToken(token) {
  if (token) localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  // call server logout to clear cookie
  fetch(apiBase + "/logout", { method: "POST" }).catch(() => {});
  window.location.href = "/login";
}

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

// Attach form handlers when loaded
ensureToastContainer();

// If user is already logged in, prevent showing login/register pages
try {
  const path = window.location.pathname || "";
  const isAuthPage =
    path.endsWith("/login") ||
    path.endsWith("/login.html") ||
    path.endsWith("/register") ||
    path.endsWith("/register.html");
  if (isAuthPage && getToken()) {
    showToast("Already logged in", "info");
    setTimeout(() => (window.location.href = "/dashboard.html"), 700);
  }
} catch (err) {
    // ignore if localStorage is not accessible
    console.log(err)
}

if (document.getElementById("registerForm")) {
  const form = document.getElementById("registerForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    if (!username) return showToast("Please enter your name", "error");
    if (!isValidEmail(email))
      return showToast("Please enter a valid email", "error");
    if (!password || password.length < 6)
      return showToast("Password must be at least 6 characters", "error");

    const payload = { username, email, password };
    const res = await register(payload);
    if (res.status === 201) {
      saveToken(res.data.token);
      showToast("Registered successfully", "success");
      setTimeout(() => (window.location.href = "/dashboard.html"), 800);
    } else {
      showToast(res.data.message || "Registration failed", "error");
    }
  });
}

if (document.getElementById("loginForm")) {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    if (!isValidEmail(email))
      return showToast("Please enter a valid email", "error");
    if (!password) return showToast("Please enter your password", "error");

    const payload = { email, password };
    const res = await login(payload);
    if (res.status === 200) {
      saveToken(res.data.token);
      showToast("Login successful", "success");
      setTimeout(() => (window.location.href = "/dashboard.html"), 600);
    } else {
      showToast(res.data.message || "Login failed", "error");
    }
  });
}

// expose logout for other scripts
window.appAuth = { logout, showToast };
