import { useState } from "react";
import { TABLE_ORDER } from "../tableSchemas";
import InsertForm from "./InsertForm";
import "./InsertForm.css";

export default function InsertPage() {
  const [table, setTable] = useState("SPECIES");

  return (
    <div className="insert-page">
      <div className="insert-form-card">
        <h2>Insert Row</h2>

        <div className="row">
          <label>Table</label>
          <select
            value={table}
            onChange={e => setTable(e.target.value)}
          >
            {TABLE_ORDER.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <InsertForm table={table} />
      </div>
    </div>
  );
}