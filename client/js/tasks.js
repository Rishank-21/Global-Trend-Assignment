import { getToken } from "./auth.js";

const tasksBase = "/api/tasks";
let currentEditTask = null;

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

function authHeaders() {
  const token = getToken();
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

async function api(path, opts) {
  const res = await fetch(path, opts);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

export async function fetchTasks() {
  return await api(tasksBase, { method: "GET", headers: authHeaders() });
}

export async function createTask(payload) {
  return await api(tasksBase, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function updateTask(id, payload) {
  return await api(`${tasksBase}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(id) {
  return await api(`${tasksBase}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

// Modal Management
function openEditModal(task) {
  currentEditTask = task;
  document.getElementById("editTitle").value = task.title;
  document.getElementById("editDescription").value = task.description;
  document.getElementById("editStatus").value = task.status || "pending";
  document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  currentEditTask = null;
}

// UI wiring
const tasksList = document.getElementById("tasksList");
const taskForm = document.getElementById("taskForm");

ensureToastContainer();

// If user is not logged in, prevent accessing dashboard/tasks pages
try {
  if (!getToken()) {
    
    showToast("Please login to continue", "error");
    setTimeout(() => (window.location.href = "/login"), 700);
  }
} catch (err) {
  // ignore
  console.log(err)
}

async function loadTasks() {
  const res = await fetchTasks();
  if (res.status === 200) {
    renderTasks(res.data);
  } else if (res.status === 401) {
    showToast("Please login", "error");
    setTimeout(() => (window.location.href = "/login"), 700);
  } else {
    console.error("Failed to fetch tasks", res);
    showToast("Failed to load tasks", "error");
  }
}

function renderTasks(tasks) {
  tasksList.innerHTML = "";
  if (!tasks || tasks.length === 0) {
    tasksList.innerHTML =
      '<div class="empty-state"><p>No tasks yet. Create one to get started!</p></div>';
    return;
  }
  tasks.forEach((t) => {
    const li = document.createElement("li");
    const status = t.status || "pending";
    li.className = `task-card status-${status}`;
    const statusLabel =
      status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
    li.innerHTML = `
      <h3>
        ${escapeHtml(t.title)}
        <span class="status-badge">${statusLabel}</span>
      </h3>
      <p>${escapeHtml(t.description)}</p>
      <div class="task-actions">
        <button class="editBtn" data-id="${t._id}">✏️ Edit</button>
        <button class="deleteBtn" data-id="${t._id}">🗑️ Delete</button>
      </div>
    `;
    tasksList.appendChild(li);
  });
  // attach listeners
  document.querySelectorAll(".deleteBtn").forEach((b) =>
    b.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const res = await deleteTask(id);
      if (res.status >= 200 && res.status < 300) {
        showToast("Task deleted", "success");
        loadTasks();
      } else {
        showToast(res.data.message || "Failed to delete task", "error");
      }
    }),
  );
  document.querySelectorAll(".editBtn").forEach((b) =>
    b.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const task = tasks.find((t) => t._id === id);
      if (task) openEditModal(task);
    }),
  );
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

if (taskForm) {
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    if (!title || !description)
      return showToast("Please provide title and description", "error");
    const res = await createTask({ title, description });
    if (res.status >= 200 && res.status < 300) {
      showToast("Task created", "success");
      taskForm.reset();
      loadTasks();
    } else {
      showToast(res.data.message || "Failed to create task", "error");
    }
  });
}

// Edit Modal Handler
const editModalForm = document.getElementById("editModalForm");
if (editModalForm) {
  editModalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentEditTask) return;
    const title = document.getElementById("editTitle").value.trim();
    const description = document.getElementById("editDescription").value.trim();
    const status = document.getElementById("editStatus").value;
    if (!title || !description)
      return showToast("Please provide title and description", "error");
    const res = await updateTask(currentEditTask._id, {
      title,
      description,
      status,
    });
    if (res.status >= 200 && res.status < 300) {
      showToast("Task updated", "success");
      closeEditModal();
      loadTasks();
    } else {
      showToast(res.data.message || "Failed to update task", "error");
    }
  });
}

const closeModalBtn = document.getElementById("closeEditModal");
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeEditModal);
}

const cancelModalBtn = document.getElementById("cancelEditModal");
if (cancelModalBtn) {
  cancelModalBtn.addEventListener("click", closeEditModal);
}

// Close modal when clicking outside
const editModal = document.getElementById("editModal");
if (editModal) {
  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) closeEditModal();
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn)
  logoutBtn.addEventListener("click", () => {
    window.appAuth?.logout();
  });

// initial load
loadTasks();
