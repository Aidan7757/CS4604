import InsertForm from "./InsertForm";
import "./Form.css";

export default function AddOrganizationForm({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Organization</h2>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>

        <div className="modal-body">
          <InsertForm
            table="ORGANIZATION"
            onSuccess={() => {
              if (onSuccess) onSuccess();
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}