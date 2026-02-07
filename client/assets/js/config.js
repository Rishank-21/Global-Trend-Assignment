// Configuration management

let configCache = null;

export async function getBackendUrl() {
  if (configCache) return configCache;

  // If already on localhost, use it directly (skip config fetch)
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    configCache = `http://${window.location.hostname}:3000`;
    return configCache;
  }

  // Use deployed backend URL for production
  configCache = "https://global-trend-assignment.onrender.com";
  return configCache;
}
