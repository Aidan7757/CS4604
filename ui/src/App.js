import React, { useState } from "react";
import "./App.css";
import ActionButton from "./components/ActionButton";
import api from "./services/api";

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

  return (
    <div className="App single-screen">
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
      </header>
    </div>
  );
}

export default App;
