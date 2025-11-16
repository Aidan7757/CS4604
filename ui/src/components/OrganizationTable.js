import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AddOrganizationForm from "./AddOrganizationForm";
import "./ParksPage.css";
import "./DetailPages.css";

export default function OrganizationTable() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrganizations = useCallback(async () => {
    setStatus("loading");
    setMsg("");
    try {
      const data = await api.listRows("organization"); // /select/organization
      setRows(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Failed to load organizations");
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const search = query.toLowerCase();
  const filtered = rows.filter((row) => {
    // IMPORTANT: use org_name and org_type (these match your DB columns)
    const text = `${row.org_name ?? ""} ${row.org_type ?? ""} ${
      row.contact_email ?? ""
    } ${row.phone_number ?? ""}`.toLowerCase();
    return text.includes(search);
  });

  return (
    <div className="parks-page parks-page--light">
      <Link to="/" className="back-link">
        ← Back to Explore
      </Link>

      <div className="page-header-simple">
        <div>
          <h1>Organizations</h1>
          <p>View organizations that collaborate with the park system.</p>
        </div>

        <button
          className="add-park-button"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Add Organization
        </button>
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
              {/* use org_name + org_type from DB */}
              <h2>{o.org_name}</h2>
              <p>
                <strong>Type:</strong> {o.org_type || "—"}
              </p>
              <p>
                <strong>Contact email:</strong> {o.contact_email}
              </p>
              <p>
                <strong>Phone number:</strong> {o.phone_number}
              </p>
            </div>
          ))}
        </div>
      )}

      <AddOrganizationForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOrganizations} // refresh after insert
      />
    </div>
  );
}