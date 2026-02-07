
import { getBackendUrl } from "../config.js";
import { postJSON } from "../utils/api.js";

let authApiBase = "";

(async () => {
  authApiBase = (await getBackendUrl()) + "/api/auth";
})();

export async function register(payload) {
  
  while (!authApiBase) {
    await new Promise((r) => setTimeout(r, 50));
  }
  return await postJSON(authApiBase + "/register", payload);
}

export async function login(payload) {
 
  while (!authApiBase) {
    await new Promise((r) => setTimeout(r, 50));
  }
  return await postJSON(authApiBase + "/login", payload);
}

export function saveToken(token) {
  if (token) localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
 
  if (authApiBase) {
    fetch(authApiBase + "/logout", { method: "POST" }).catch(() => {});
  }
  window.location.href = "/login.html";
}
