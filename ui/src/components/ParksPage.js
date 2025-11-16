import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import FormModal from "./FormModal";
import InsertForm from "./InsertForm";
import "./ParksPage.css";

export default function ParksPage() {
  const [parks, setParks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchParks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.listRows('park');
      setParks(response || []);
    } catch (error) {
      console.error("Error fetching parks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParks();
  }, [fetchParks]);

  if (loading && !parks) {
    return <div>Loading parks...</div>;
  }

  return (
    <div className="parks-page">
      <div className="page-header">
        <h1>Explore National Parks</h1>
        <button onClick={() => setIsModalOpen(true)} className="add-park-button">
          Add New Park
        </button>
      </div>

      <div className="park-card-container">
        {Array.isArray(parks) && parks.map(park => (
          <Link to={`/parks/${park.park_id}`} key={park.park_id} className="park-card">
            <h2>{park.park_name}</h2>
            <p>Status: {park.status}</p>
          </Link>
        ))}
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Park"
      >
        <InsertForm
          table="PARK"
          onSuccess={() => {
            setIsModalOpen(false);
            fetchParks();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </FormModal>
    </div>
  );
}
