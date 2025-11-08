import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./InsertForm.css"; // reuse the same styling

export default function SpeciesTable() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setStatus("loading");
      setMsg("Loading species…");
      try {
        const data = await api.listRows("species");  // calls /select/species
        if (!ignore) {
          setRows(Array.isArray(data) ? data : []);
          setStatus("success");
          setMsg("");
        }
      } catch (err) {
        if (!ignore) {
          setStatus("error");
          setMsg(err.message || "Failed to load species");
        }
      }
    }

    load();
    return () => { ignore = true; };
  }, []);

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div className="insert-page">
      <div className="insert-form-card">
        <h2>Species Table</h2>

        {status === "loading" && (
          <div className="form-status">Loading…</div>
        )}

        {status === "error" && (
          <div className="form-status">{msg}</div>
        )}

        {status === "success" && rows.length === 0 && (
          <div className="form-status">No rows found.</div>
        )}

        {rows.length > 0 && (
          <div style={{ maxHeight: "300px", overflow: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  {columns.map(col => (
                    <th
                      key={col}
                      style={{ borderBottom: "1px solid #ccc", padding: "4px" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map(col => (
                      <td
                        key={col}
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "4px",
                          fontSize: "0.9rem"
                        }}
                      >
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {msg && status !== "loading" && status !== "error" && (
          <div className="form-status">{msg}</div>
        )}
      </div>
    </div>
  );
}