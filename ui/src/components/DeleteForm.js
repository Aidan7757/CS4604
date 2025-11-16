import api from "../services/api";
import "./Form.css";

export default function DeleteForm({
  isOpen,
  tableName,
  id,
  onSuccess,
  onCancel,
}) {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      await api.del(tableName, { [tableName + "_id"]: id });
      onSuccess();
    } catch (error) {
      console.error(`Failed to delete from ${tableName}:`, error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Delete {tableName}</h2>
          <button onClick={onCancel} className="close-button">
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this item?</p>
          <div className="form-actions">
            <button onClick={handleDelete}>Delete</button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}