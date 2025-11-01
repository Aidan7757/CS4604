import React, { useMemo, useState } from "react";
import api from "../services/api";
import { TABLE_SCHEMAS, TABLE_ORDER } from "../tableSchemas";
import "./InsertForm.css";

function toMySQLDateTime(localValue) {
  const d = new Date(localValue);
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function InsertForm() {
  const [table, setTable] = useState("SPECIES");
  const [values, setValues] = useState({});
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  const fields = useMemo(() => TABLE_SCHEMAS[table] ?? [], [table]);

  function setField(name, val) {
    setValues(v => ({ ...v, [name]: val }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("loading"); setMsg("Inserting…");

    const payload = {};
    for (const f of fields) {
      let v = values[f.name];
      if (f.type === "number" && v !== "" && v !== undefined) v = Number(v);
      if (f.type === "datetime-local") v = v ? toMySQLDateTime(v) : null;
      if (!f.required && (v === "" || v === undefined)) v = null;
      payload[f.name] = v;
    }

    try {
      const res = await api.insert(table, payload);
      setStatus("success");
      setMsg(res.message || `Inserted into ${table}`);
      setValues({});
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Insert failed");
    }
  }

  return (
    <div className="insert-page">
      <div className="insert-form-card">
        <h2>Insert Row</h2>

        <div className="row">
          <label>Table</label>
          <select
            value={table}
            onChange={e => {
              setTable(e.target.value);
              setValues({});
              setStatus("idle");
              setMsg("");
            }}
          >
            {TABLE_ORDER.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <form onSubmit={onSubmit}>
          {fields.map(f => (
            <div className="row" key={f.name}>
              <label htmlFor={f.name}>{f.name}{f.required ? " *" : ""}</label>
              <input
                id={f.name}
                type={f.type}
                value={values[f.name] ?? ""}
                onChange={e => setField(f.name, e.target.value)}
                required={f.required}
              />
            </div>
          ))}

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Saving…" : `Insert into ${table}`}
          </button>
        </form>

        <div className="form-status">{msg}</div>
      </div>
    </div>
  );
}