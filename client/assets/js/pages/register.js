// Register page logic
import { register } from "../services/authService.js";
import { saveToken } from "../services/authService.js";
import { showToast } from "../utils/toast.js";
import { isValidEmail } from "../utils/helpers.js";

export function initRegisterPage() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!username) {
      return showToast("Please enter your name", "error");
    }
    if (!isValidEmail(email)) {
      return showToast("Please enter a valid email", "error");
    }
    if (!password || password.length < 6) {
      return showToast("Password must be at least 6 characters", "error");
    }

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
