import React, { useState } from "react";
import "./App.css";
import ActionButton from "./components/ActionButton";
import api from "./services/api";
import { Routes, Route, Link } from "react-router-dom";
import InsertForm from "./components/InsertForm";
import DeleteForm from "./components/DeleteForm";
import SpeciesTable from "./components/SpeciesTable";
import VisitorTable from "./components/VisitorTable";
import OrganizationTable from "./components/OrganizationTable";

function App() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleConnect() {
    setStatus("loading");
    setMessage("Connecting...");
    try {
      const res = await api.connect();
      setStatus("connected");
      setMessage(res.message || "Connected to database");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Failed to connect");
    }
  }

    const Home = (
    <header className="App-header">
      <h1>Database Connector</h1>
      <p>Click the button to connect to the database endpoint.</p>

      <ActionButton
        label={status === "loading" ? "Connecting…" : "Connect"}
        onClick={handleConnect}
        disabled={status === "loading" || status === "connected"}
      />

      <div className={`status status--${status}`}>
        {message || (status === "idle" ? "Not connected" : "")}
      </div>

      <Link to="/insert">
        <button style={{ marginTop: 16 }}>Go to Insert Page</button>
      </Link>

      <Link to="/delete">
        <button style={{ marginTop: 8 }}>Go to Delete Page</button>
      </Link>

      <Link to="/view/species">
        <button style={{ marginTop: 8 }}>View Species</button>
      </Link>

      <Link to="/view/visitors">
        <button style={{ marginTop: 8 }}>View Visitors</button>
      </Link>
      <Link to="/view/organizations">
        <button style={{ marginTop: 8 }}>View Organizations</button>
      </Link>
    </header>
  );

  const InsertPage = (
    <div className="App-header">
      <InsertForm />
    </div>
  );

  const DeletePage = (
    <div className="App-header">
      <DeleteForm />
    </div>
  );

  return (
    <div className="App single-screen">
      <Routes>
        <Route path="/" element={Home} />
        <Route path="/insert" element={InsertPage} />
        <Route path="/delete" element={DeletePage} />
        <Route
          path="/view/species"
          element={
            <div className="App-header">
              <SpeciesTable />
            </div>
          }
        />
        <Route
          path="/view/visitors"
          element={
            <div className="App-header">
              <VisitorTable />
            </div>
          }
        />
        <Route
          path="/view/organizations"
          element={
            <div className="App-header">
              <OrganizationTable />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
