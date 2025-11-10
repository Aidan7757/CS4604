import api from "../services/api";
import "./Form.css";

export default function DeleteParkForm({ isOpen, onClose, onSuccess, parkId }) {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      await api.deletePark(parkId);
      onSuccess();
    } catch (error) {
      console.error("Failed to delete park:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Delete Park</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this park?</p>
          <div className="form-actions">
            <button onClick={handleDelete}>Delete</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
