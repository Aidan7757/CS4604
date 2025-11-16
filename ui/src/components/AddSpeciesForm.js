import InsertForm from "./InsertForm";
import "./Form.css";

export default function AddSpeciesForm({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Species</h2>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>

        <div className="modal-body">
          <InsertForm
            table="SPECIES"
            onSuccess={() => {
              if (onSuccess) onSuccess(); // refresh list in parent
              onClose();                   // close modal
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}