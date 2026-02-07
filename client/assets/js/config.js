

let configCache = null;

export async function getBackendUrl() {
  if (configCache) return configCache;


  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    configCache = `http://${window.location.hostname}:3000`;
    return configCache;
  }

  
  configCache = "https://global-trend-assignment.onrender.com";
  return configCache;
}
