import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AddVisitorForm from "./AddVisitorForm";
import "./ParksPage.css";
import "./DetailPages.css";

export default function VisitorTable() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVisitors = useCallback(async () => {
    setStatus("loading");
    setMsg("");
    try {
      const data = await api.listRows("visitor"); // /select/visitor
      setRows(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Failed to load visitors");
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const search = query.toLowerCase();
  const filtered = rows.filter((row) => {
    const text = `${row.name ?? ""} ${row.age ?? ""} ${
      row.hour_entered ?? ""
    }`.toLowerCase();
    return text.includes(search);
  });

  return (
    <div className="parks-page parks-page--light">
      <Link to="/" className="back-link">
        ← Back to Explore
      </Link>

      <div className="page-header-simple">
        <div>
          <h1>Visitors</h1>
          <p>View visitor information including age and time of entry.</p>
        </div>

        {/* Add Visitor button opens the modal */}
        <button
          className="add-park-button"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Add Visitor
        </button>
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
          {filtered.map((v) => {
            // format time if it exists
            const enteredTime = v.hour_entered
              ? new Date(v.hour_entered).toLocaleString()
              : null;

            return (
              <div key={v.visitor_id} className="park-card">
                <p>
                  <strong>Name:</strong> {v.name}
                </p>
                <p>
                  <strong>Visitor ID:</strong> {v.visitor_id}
                </p>
                <p>
                  <strong>Age:</strong> {v.age}
                </p>

                {enteredTime && (
                  <p>
                    <strong>Time entered park:</strong> {enteredTime}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for inserting a visitor */}
      <AddVisitorForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchVisitors} // refresh list after insert
      />
    </div>
  );
}