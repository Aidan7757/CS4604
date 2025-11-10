import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import UpdateParkForm from "./UpdateParkForm";
import DeleteParkForm from "./DeleteParkForm";
import "./SingleParkPage.css";

export default function SingleParkPage() {
  const { parkId } = useParams();
  const navigate = useNavigate();
  const [park, setPark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchPark = async () => {
    try {
      const response = await api.getParkById(parkId);
      setPark(response);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching park with ID ${parkId}:`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPark();
  }, [parkId]);

  const handleUpdateSuccess = () => {
    setUpdateModalOpen(false);
    fetchPark();
  };

  const handleDeleteSuccess = () => {
    setDeleteModalOpen(false);
    navigate('/parks');
  };

  if (loading) {
    return <div>Loading park data...</div>;
  }

  if (!park) {
    return <div>Park not found.</div>;
  }

  return (
    <div className="single-park-page">
      <h1>{park.park_name}</h1>
      <div className="park-details">
        <p><strong>Status:</strong> {park.status}</p>
      </div>
      <div className="park-actions">
        <button onClick={() => setUpdateModalOpen(true)}>Update</button>
        <button onClick={() => setDeleteModalOpen(true)}>Delete</button>
      </div>

      <UpdateParkForm
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onSuccess={handleUpdateSuccess}
        parkData={park}
      />

      <DeleteParkForm
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={handleDeleteSuccess}
        parkId={parkId}
      />
    </div>
  );
}