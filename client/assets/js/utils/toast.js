
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

export function showToast(message, type = "info") {
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

export { ensureToastContainer };
