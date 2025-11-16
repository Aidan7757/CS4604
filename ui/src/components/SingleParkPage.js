import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import FormModal from "./FormModal";
import UpdateForm from "./UpdateForm";
import DeleteForm from "./DeleteForm";
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
      const response = await api.get('park', parkId);
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

      <FormModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        title="Update Park"
      >
        <UpdateForm
          tableName="PARK"
          id={parkId}
          initialData={park}
          onSuccess={handleUpdateSuccess}
          onCancel={() => setUpdateModalOpen(false)}
        />
      </FormModal>

      <DeleteForm
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        tableName="PARK"
        id={parkId}
        onSuccess={handleDeleteSuccess}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}