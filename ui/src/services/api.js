const BASE = "http://127.0.0.1:5001";
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

export async function listRows(table) {
  const res = await fetch(`${BASE}/select/${table.toLowerCase()}`); 
  if (!res.ok) {
    throw new Error(`Failed to load rows (${res.status})`);
  }

  return res.json();
}

export async function del(table, where) {
  const resp = await fetch(`${BASE}/delete/${table.toLowerCase()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(where),
  });
  const text = await resp.text();

  let data;  
  try { 
    data = JSON.parse(text); 
  } catch { 
    data = { message: text }; 
  }

  if (!resp.ok) {
    throw new Error(data.error_message || data.message || `Delete failed: ${resp.status}`);
  }

  return data;
}

export default { connect, insert, listRows, del };