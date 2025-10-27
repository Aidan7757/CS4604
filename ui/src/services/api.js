const BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

export async function connect() {
  const url = `${BASE}/connect`;
  const resp = await fetch(url, { method: "GET" });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Request failed ${resp.status}: ${text}`);
  }
  return resp.json().catch(() => ({ ok: true }));
}

export default { connect };
