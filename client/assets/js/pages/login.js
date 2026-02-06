// Login page logic
import { login } from "../services/authService.js";
import { saveToken } from "../services/authService.js";
import { showToast } from "../utils/toast.js";
import { isValidEmail } from "../utils/helpers.js";

export function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!isValidEmail(email)) {
      return showToast("Please enter a valid email", "error");
    }
    if (!password) {
      return showToast("Please enter your password", "error");
    }

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
