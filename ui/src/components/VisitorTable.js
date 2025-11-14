import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./ParksPage.css";
import "./DetailPages.css";

export default function VisitorTable() {
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
        const data = await api.listRows("visitor"); // /select/visitor
        if (!ignore) {
          setRows(Array.isArray(data) ? data : []);
          setStatus("success");
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

  const search = query.toLowerCase();
  const filtered = rows.filter((row) => {
    const text = `${row.name ?? ""} ${row.age ?? ""} ${row.email ?? ""}`.toLowerCase();
    return text.includes(search);
  });

  return (
    <div className="parks-page">
      <Link to="/" className="back-link">
        ← Back to Explore
      </Link>

      <div className="page-header-simple">
        <h1>Visitors</h1>
        <p>View visitor information including age and time of entry.</p>
      </div>

      <div className="search-row">
        <input
          className="search-input"
          type="text"
          placeholder="Search visitors…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {status === "loading" && <div>Loading…</div>}
      {status === "error" && <div>{msg}</div>}
      {status === "success" && filtered.length === 0 && (
        <div>No visitors found.</div>
      )}

      {filtered.length > 0 && (
        <div className="park-card-grid">
          {filtered.map((v) => (
            <div key={v.visitor_id} className="park-card">
              <p>
                <strong>Name:</strong> {v.name}
              </p>
              <p>
                <strong>ID:</strong> {v.visitor_id}
              </p>
              <p>
                <strong>Age:</strong> {v.age}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}