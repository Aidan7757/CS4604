import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AddSpeciesForm from "./AddSpeciesForm";
import "./ParksPage.css";
import "./DetailPages.css";

export default function SpeciesTable() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSpecies = useCallback(async () => {
    setStatus("loading");
    setMsg("");
    try {
      const data = await api.listRows("species");
      setRows(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Failed to load species");
    }
  }, []);

  useEffect(() => {
    fetchSpecies();
  }, [fetchSpecies]);

  const search = query.toLowerCase();
  const filtered = rows.filter((row) => {
    const text = `${row.common_name ?? ""} ${row.scientific_name ?? ""} ${
      row.conservation_status ?? ""
    }`.toLowerCase();
    return text.includes(search);
  });

  return (
    <div className="parks-page parks-page--light">
      <Link to="/" className="back-link">← Back to Explore</Link>

      {/* MATCH Visitor layout: title left + button right */}
      <div className="page-header-simple">
        <div>
          <h1>Species</h1>
          <p>View all tracked species in the park system.</p>
        </div>

        <button
          className="add-park-button"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Add Species
        </button>
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
              <p><strong>Scientific name:</strong> {s.scientific_name}</p>
              <p><strong>Conservation status:</strong> {s.conservation_status}</p>
              <p><strong>Estimated count:</strong> {s.species_count}</p>
            </div>
          ))}
        </div>
      )}

      <AddSpeciesForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSpecies}
      />
    </div>
  );
}