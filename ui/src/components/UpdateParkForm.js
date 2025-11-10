import { useState, useEffect } from "react";
import api from "../services/api";
import "./Form.css"; 

export default function UpdateParkForm({ isOpen, onClose, onSuccess, parkData }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (parkData) {
      setFormData({
        park_name: parkData.park_name || "",
        status: parkData.status || "",
      });
    }
  }, [parkData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updatePark(parkData.park_id, formData);
      onSuccess();
    } catch (error) {
      console.error("Failed to update park:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Update Park</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <label>
              Park Name:
              <input
                type="text"
                name="park_name"
                value={formData.park_name}
                onChange={handleChange}
              />
            </label>
            <label>
              Status:
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
              />
            </label>
            <div className="form-actions">
              <button type="submit">Update</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
