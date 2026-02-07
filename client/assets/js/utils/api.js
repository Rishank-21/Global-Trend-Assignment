

export async function postJSON(url, body) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function fetchWithAuth(path, opts = {}) {
  const defaultHeaders = { "Content-Type": "application/json" };
  const headers = { ...defaultHeaders, ...opts.headers };

  const res = await fetch(path, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

export function getAuthHeaders(token) {
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}
