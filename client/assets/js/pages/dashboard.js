// Dashboard page logic
import { getToken } from "../services/authService.js";
import { logout } from "../services/authService.js";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService.js";
import { showToast } from "../utils/toast.js";
import { escapeHtml } from "../utils/helpers.js";

let currentEditTask = null;
const tasksList = document.getElementById("tasksList");
const taskForm = document.getElementById("taskForm");

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

  // Attach listeners
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

export function initDashboardPage() {
  // Check if user is logged in
  if (!getToken()) {
    showToast("Please login to continue", "error");
    setTimeout(() => (window.location.href = "/login"), 700);
    return;
  }

  // Task form submission
  if (taskForm) {
    taskForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value.trim();
      const description = document.getElementById("description").value.trim();

      if (!title || !description) {
        return showToast("Please provide title and description", "error");
      }

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
      const description = document
        .getElementById("editDescription")
        .value.trim();
      const status = document.getElementById("editStatus").value;

      if (!title || !description) {
        return showToast("Please provide title and description", "error");
      }

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

  // Modal close handlers
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

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Load tasks on page load
  loadTasks();
}
