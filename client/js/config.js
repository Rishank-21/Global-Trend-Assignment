// Fetch backend configuration from server
let configCache = null;

export async function getBackendUrl() {
  if (configCache) return configCache;

  try {
    // Try to fetch from the current domain first (works for same-origin or deployed)
    const response = await fetch("/api/config");
    if (response.ok) {
      const config = await response.json();
      configCache = config.backendUrl;
      return configCache;
    }
  } catch (error) {
    console.warn("Could not fetch config from /api/config:", error);
  }

  // Fallback to localhost for development
  return "http://localhost:3000";
}
