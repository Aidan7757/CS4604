import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./ParksPage.css";
import "./DetailPages.css";

export default function SpeciesTable() {
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
        const data = await api.listRows("species"); // /select/species
        if (!ignore) {
          setRows(Array.isArray(data) ? data : []);
          setStatus("success");
        }
      } catch (err) {
        if (!ignore) {
          setStatus("error");
          setMsg(err.message || "Failed to load species");
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
    const text = `${row.common_name ?? ""} ${row.scientific_name ?? ""} ${
      row.conservation_status ?? ""
    }`.toLowerCase();
    return text.includes(search);
  });

  return (
    <div className="parks-page">
      <Link to="/" className="back-link">
        ← Back to Explore
      </Link>

      <div className="page-header-simple">
        <h1>Species</h1>
        <p>View all tracked species in the park system.</p>
      </div>

      <div className="search-row">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name or status…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {status === "loading" && <div>Loading…</div>}
      {status === "error" && <div>{msg}</div>}
      {status === "success" && filtered.length === 0 && (
        <div>No species found.</div>
      )}

      {filtered.length > 0 && (
        <div className="park-card-grid">
          {filtered.map((s) => (
            <div key={s.species_id} className="park-card">
              <h2>{s.common_name}</h2>
              <p>
                <strong>Scientific name:</strong> {s.scientific_name}
              </p>
              <p>
                <strong>Conservation status:</strong> {s.conservation_status}
              </p>
              <p>
                <strong>Estimated count:</strong> {s.species_count}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}