import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import ParksPage from "./components/ParksPage";
import SingleParkPage from "./components/SingleParkPage";
import AlertsPage from "./components/AlertsPage";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/parks" element={<ParksPage />} />
        <Route path="/parks/:parkId" element={<SingleParkPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
      </Routes>
    </div>
  );
}

