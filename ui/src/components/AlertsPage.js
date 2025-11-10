import { useState, useEffect } from "react";
import api from "../services/api";
import "./AlertsPage.css";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchAlerts();
  }, []);

  if (loading) {
    return <div>Loading alerts...</div>;
  }

  return (
    <div className="alerts-page">
      <h1>Alerts</h1>
      <div className="alert-list-container">
        {Array.isArray(alerts) && alerts.length > 0 ? (
          alerts.map(alert => (
            <div key={alert.alert_id} className="alert-card">
              <h2>{alert.title}</h2>
              <p>{alert.message}</p>
              <span className="park-id">Park: {alert.park_name}</span>
            </div>
          ))
        ) : (
          <p>No alerts at the moment.</p>
        )}
      </div>
    </div>
  );
}
