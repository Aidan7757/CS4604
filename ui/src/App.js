import React, { useState } from "react";
import "./App.css";
import ActionButton from "./components/ActionButton";
import api from "./services/api";
import { Routes, Route, Link } from "react-router-dom";
import InsertForm from "./components/InsertForm";

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
    </header>
  );

  const InsertPage = (
    <div className="App-header">
      <InsertForm />
    </div>
  );

  return (
    <div className="App single-screen">
      <Routes>
        <Route path="/" element={Home} />
        <Route path="/insert" element={InsertPage} />
      </Routes>
    </div>
  );
}

export default App;
