import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./ParksPage.css";
import "./DetailPages.css";

export default function OrganizationTable() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setStatus("loading");
      setMsg("");
      try {
        const data = await api.listRows("organization"); // /select/organization
        if (!ignore) {
          setRows(Array.isArray(data) ? data : []);
          setStatus("success");
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

  const search = query.toLowerCase();
  const filtered = rows.filter((row) => {
    const text = `${row.name ?? ""} ${row.type ?? ""} ${
      row.contact_email ?? ""
    } ${row.phone_number ?? ""}`.toLowerCase();
    return text.includes(search);
  });

  return (
    <div className="parks-page">
      <Link to="/" className="back-link">
        ← Back to Explore
      </Link>

      <div className="page-header-simple">
        <h1>Partner Organizations</h1>
        <p>View organizations that collaborate with the park system.</p>
      </div>

      <div className="search-row">
        <input
          className="search-input"
          type="text"
          placeholder="Search organizations…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {status === "loading" && <div>Loading…</div>}
      {status === "error" && <div>{msg}</div>}
      {status === "success" && filtered.length === 0 && (
        <div>No organizations found.</div>
      )}

      {filtered.length > 0 && (
        <div className="park-card-grid">
          {filtered.map((o) => (
            <div key={o.org_id} className="park-card">
              <h2>{o.org_name}</h2>
              <p>
                <strong>Type:</strong> {o.org_type}
              </p>
              <p>
                <strong>Contact email:</strong> {o.contact_email}
              </p>
              <p>
                <strong>Phone number:</strong>{" "}
                <span style={{ whiteSpace: "nowrap" }}>{o.phone_number}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}