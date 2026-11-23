const BASE_URL = (
  import.meta.env.VITE_API_URL || "https://gabunada-mte-s86.onrender.com"
).replace(/\/+$/, "");

export async function apiRequest(endpoint, { method = "GET", body, token } = {}) {
  const cleanPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${cleanPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}