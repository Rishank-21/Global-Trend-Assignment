
import { getBackendUrl } from "../config.js";
import { getAuthHeaders } from "../utils/api.js";
import { getToken } from "./authService.js";

let tasksApiBase = "";


(async () => {
  tasksApiBase = (await getBackendUrl()) + "/api/tasks";
})();

async function api(path, opts) {
  const res = await fetch(path, opts);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

export async function fetchTasks() {
 
  while (!tasksApiBase) {
    await new Promise((r) => setTimeout(r, 50));
  }
  const token = getToken();
  return await api(tasksApiBase, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
}

export async function createTask(payload) {
 
  while (!tasksApiBase) {
    await new Promise((r) => setTimeout(r, 50));
  }
  const token = getToken();
  return await api(tasksApiBase, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function updateTask(id, payload) {

  while (!tasksApiBase) {
    await new Promise((r) => setTimeout(r, 50));
  }
  const token = getToken();
  return await api(`${tasksApiBase}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(id) {
 
  while (!tasksApiBase) {
    await new Promise((r) => setTimeout(r, 50));
  }
  const token = getToken();
  return await api(`${tasksApiBase}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
}
