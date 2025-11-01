const BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

export async function connect() {
  const url = `${BASE}/connect`;
  const resp = await fetch(url, { method: "POST" });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Request failed ${resp.status}: ${text}`);
  }
  return resp.json().catch(() => ({ ok: true }));
}

export async function insert(table, payload) {
  const resp = await fetch(`${BASE}/insert/${table.toLowerCase()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    throw new Error(
      error.error_message || error.message || `Insert failed: ${resp.status}`
    );
  }

  return resp.json();
}

export default { connect, insert };