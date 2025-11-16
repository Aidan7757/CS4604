import { useState, useEffect } from "react";
import api from "../services/api";
import FormModal from "./FormModal";
import InsertForm from "./InsertForm";
import UpdateForm from "./UpdateForm";
import DeleteForm from "./DeleteForm";
import "./AlertsPage.css";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  async function fetchAlerts() {
    try {
      const response = await api.getAlerts();
      setAlerts(response || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleUpdateClick = (alert) => {
    setSelectedAlert(alert);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (alert) => {
    setSelectedAlert(alert);
    setDeleteModalOpen(true);
  };

  if (loading) {
    return <div>Loading alerts...</div>;
  }

  return (
    <div className="alerts-page">
      <h1>Alerts</h1>
      <button onClick={() => setAddModalOpen(true)}>Add Alert</button>
      <div className="alert-list-container">
        {Array.isArray(alerts) && alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.alert_id} className="alert-card">
              <h2>{alert.title}</h2>
              <p>{alert.message}</p>
              <span className="park-id">Park: {alert.park_name}</span>
              <div className="alert-actions">
                <button onClick={() => handleUpdateClick(alert)}>Update</button>
                <button onClick={() => handleDeleteClick(alert)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No alerts at the moment.</p>
        )}
      </div>

      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Alert"
      >
        <InsertForm
          table="ALERT"
          onSuccess={() => {
            setAddModalOpen(false);
            fetchAlerts();
          }}
          onCancel={() => setAddModalOpen(false)}
        />
      </FormModal>

      {selectedAlert && (
        <>
          <FormModal
            isOpen={isUpdateModalOpen}
            onClose={() => setUpdateModalOpen(false)}
            title="Update Alert"
          >
            <UpdateForm
              tableName="ALERT"
              id={selectedAlert.alert_id}
              initialData={selectedAlert}
              onSuccess={() => {
                setUpdateModalOpen(false);
                fetchAlerts();
              }}
              onCancel={() => setUpdateModalOpen(false)}
            />
          </FormModal>

          <DeleteForm
            isOpen={isDeleteModalOpen}
            tableName="ALERT"
            id={selectedAlert.alert_id}
            onSuccess={() => {
              setDeleteModalOpen(false);
              fetchAlerts();
            }}
            onCancel={() => setDeleteModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}
