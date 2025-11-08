import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./InsertForm.css";

const ORG_COLUMNS = [
  { key: "name", label: "Organization Name" },
  { key: "type", label: "Type" },
  { key: "contact_email", label: "Contact Email" },
  { key: "phone_number", label: "Phone Number" },
  // org_id is hidden from the UI
];

export default function OrganizationTable() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setStatus("loading");
      setMsg("Loading organizations...");
      try {
        const data = await api.listRows("organization");
        if (!ignore) {
          setRows(Array.isArray(data) ? data : []);
          setStatus("success");
          setMsg("");
        }
      } catch (err) {
        if (!ignore) {
          setStatus("error");
          setMsg(err.message || "Failed to load organizations");
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
        <h2>Partner Organizations</h2>
        <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
          This page shows partner organizations that work with the park system,
          including their type and contact information.
        </p>

        {status === "loading" && <div className="form-status">Loading…</div>}
        {status === "error" && <div className="form-status">{msg}</div>}

        {status === "success" && rows.length === 0 && (
          <div className="form-status">No organizations found.</div>
        )}

        {rows.length > 0 && (
          <div style={{ maxHeight: "300px", overflow: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  {ORG_COLUMNS.map(col => (
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
                    {ORG_COLUMNS.map(col => (
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