import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./InsertForm.css";

const VISITOR_COLUMNS = [
  { key: "name", label: "Visitor Name" },
  { key: "age", label: "Age" },
  { key: "hour_entered", label: "Time Entered Park" },
  // visitor_id is hidden from the UI
];

export default function VisitorTable() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setStatus("loading");
      setMsg("Loading visitors...");
      try {
        const data = await api.listRows("visitor");
        if (!ignore) {
          setRows(Array.isArray(data) ? data : []);
          setStatus("success");
          setMsg("");
        }
      } catch (err) {
        if (!ignore) {
          setStatus("error");
          setMsg(err.message || "Failed to load visitors");
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="insert-page">
      <div className="insert-form-card">
        <h2>Visitors Overview</h2>
        <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
          This page shows visitors along with their age and the time they
          entered the park.
        </p>

        {status === "loading" && <div className="form-status">Loading…</div>}
        {status === "error" && <div className="form-status">{msg}</div>}

        {status === "success" && rows.length === 0 && (
          <div className="form-status">No visitors found.</div>
        )}

        {rows.length > 0 && (
          <div style={{ maxHeight: "300px", overflow: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  {VISITOR_COLUMNS.map(col => (
                    <th
                      key={col.key}
                      style={{ borderBottom: "1px solid #ccc", padding: "4px" }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    {VISITOR_COLUMNS.map(col => (
                      <td
                        key={col.key}
                        style={{
                          borderBottom: "1px solid #eee",
                          padding: "4px",
                          fontSize: "0.9rem",
                        }}
                      >
                        {String(row[col.key])}
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