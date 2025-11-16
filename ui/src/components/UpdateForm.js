import { useEffect, useState } from "react";
import api from "../services/api";
import { TABLE_PK, TABLE_SCHEMAS } from "../tableSchemas";
import "./Form.css";
import "./InsertForm.css";

export default function UpdateForm({
  tableName,
  id,
  onSuccess,
  onCancel,
  initialData,
}) {
  const [formData, setFormData] = useState({});
  const [projects, setProjects] = useState([]);
  const [parks, setParks] = useState([]);

  const schema = TABLE_SCHEMAS[tableName];
  const pk = TABLE_PK[tableName];

  useEffect(() => {
    if (initialData) {
      const initialFormData = schema.reduce((acc, field) => {
        if (field.name !== pk) {
          acc[field.name] = initialData[field.name] || "";
        }
        return acc;
      }, {});
      setFormData(initialFormData);
    }
  }, [initialData, schema, pk]);

  useEffect(() => {
    if (tableName === "PARK") {
      api.listRows('preservation_project').then(setProjects).catch(console.error);
    }
    if (tableName === "ALERT") {
      api.listRows('park').then(setParks).catch(console.error);
    }
  }, [tableName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.update(tableName, id, formData);
      onSuccess();
    } catch (error) {
      console.error(`Failed to update ${tableName}:`, error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {schema
        .filter((field) => field.name !== pk)
        .map((field) => (
          <div className="row" key={field.name}>
            <label htmlFor={field.name}>
              {field.label || field.name}:
            </label>
            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
              >
                <option value="">-- Select an option --</option>
                {field.name === 'project_id' && projects.map(project => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.project_name}
                  </option>
                ))}
                {field.name === 'park_id' && parks.map(park => (
                  <option key={park.park_id} value={park.park_id}>
                    {park.park_name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
              />
            )}
          </div>
        ))}
      <div className="form-actions">
        <button type="submit">Update</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
