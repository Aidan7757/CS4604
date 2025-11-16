// src/components/DeleteForm.js
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { TABLE_ORDER, TABLE_PK } from "../tableSchemas";
import "./InsertForm.css";   // reuse the insert styles

export default function DeleteForm() {
  const [table, setTable] = useState("SPECIES");
  const pkName = useMemo(() => TABLE_PK[table] ?? "", [table]);

  const [rows, setRows] = useState([]);
  const [pkValue, setPkValue] = useState("");
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      setMsg("");
      setPkValue("");
      try {
        // endpoint name is lowercase (species, visitor, etc.)
        const data = await api.listRows(table.toLowerCase());
        if (!ignore) {
          setRows(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!ignore) {
          setRows([]);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [table]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!pkValue) return;

    if (!window.confirm(`Delete from ${table} where ${pkName} = ${pkValue}?`)) {
      return;
    }

    setStatus("loading");
    setMsg("Deleting…");

    try {
      const res = await api.del(table.toLowerCase(), { [pkName]: pkValue });
      setStatus("success");
      setMsg(res.message || `Deleted from ${table}`);

      // remove deleted row from local list
      setRows((rs) =>
        rs.filter((r) => String(r[pkName]) !== String(pkValue))
      );
      setPkValue("");
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Delete failed");
    }
  }

  return (
    <div className="insert-page">
      <div className="insert-form-card">
        <h2>Delete Row</h2>

        <div className="row">
          <label>Table</label>
          <select
            value={table}
            onChange={(e) => {
              setTable(e.target.value);
              setStatus("idle");
              setMsg("");
            }}
          >
            {TABLE_ORDER.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="row">
          <label>{pkName} (from existing rows)</label>
          <select
            value={pkValue}
            onChange={(e) => setPkValue(e.target.value)}
          >
            <option value="">select</option>
            {rows.map((r, idx) => {
              const keys = Object.keys(r);
              const fallbackKey = keys[0];
              const value =
                r[pkName] !== undefined ? r[pkName] : r[fallbackKey];

              return (
                <option key={idx} value={String(value)}>
                  {String(value)}
                </option>
              );
            })}
          </select>
        </div>

        <form onSubmit={onSubmit}>
          <button type="submit" disabled={!pkValue || status === "loading"}>
            {status === "loading" ? "Deleting…" : `Delete from ${table}`}
          </button>
        </form>

        <div className="form-status">{msg}</div>
      </div>
    </div>
  );
}