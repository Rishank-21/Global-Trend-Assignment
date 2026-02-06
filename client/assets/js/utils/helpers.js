// General utility helper functions

export function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function escapeHtml(str) {
  if (!str) return "";
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function isAuthPage(pathname = window.location.pathname) {
  const path = pathname || "";
  return (
    path.endsWith("/login") ||
    path.endsWith("/login.html") ||
    path.endsWith("/register") ||
    path.endsWith("/register.html")
  );
}
