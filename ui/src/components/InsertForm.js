import { useMemo, useState, useEffect } from "react";
import api from "../services/api";
import { TABLE_SCHEMAS } from "../tableSchemas";
import "./InsertForm.css";

function toMySQLDateTime(localValue) {
  const d = new Date(localValue);
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function InsertForm({ table, onSuccess, onCancel }) {
  const [values, setValues] = useState({});
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const [projects, setProjects] = useState([]);
  const [parks, setParks] = useState([]);

  const fields = useMemo(() => TABLE_SCHEMAS[table] ?? [], [table]);

  useEffect(() => {
    if (table === "PARK") {
      api.listRows('preservation_project').then(setProjects).catch(console.error);
    }
    if (table === "ALERT") {
      api.listRows('park').then(setParks).catch(console.error);
    }
  }, [table]);

  function setField(name, val) {
    setValues(v => ({ ...v, [name]: val }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMsg("Inserting…");

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
      if (onSuccess) onSuccess();
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Insert failed");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {fields.map(f => (
        <div className="row" key={f.name}>
          <label htmlFor={f.name}>{f.label || f.name}{f.required ? " *" : ""}</label>
          {f.type === "select" ? (
            <select
              id={f.name}
              value={values[f.name] ?? ""}
              onChange={e => setField(f.name, e.target.value)}
              required={f.required}
            >
              <option value="">-- Select an option --</option>
              {f.name === 'project_id' && projects.map(project => (
                <option key={project.project_id} value={project.project_id}>
                  {project.project_name}
                </option>
              ))}
              {f.name === 'park_id' && parks.map(park => (
                <option key={park.park_id} value={park.park_id}>
                  {park.park_name}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={f.name}
              type={f.type}
              value={values[f.name] ?? ""}
              onChange={e => setField(f.name, e.target.value)}
              required={f.required}
            />
          )}
        </div>
      ))}

      <div className="form-actions">
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Saving…" : `Insert into ${table}`}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={status === "loading"}>
            Cancel
          </button>
        )}
      </div>

      <div className="form-status">{msg}</div>
    </form>
  );
}
