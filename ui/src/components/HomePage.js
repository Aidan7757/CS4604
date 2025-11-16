import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <h1 className="title">Explore</h1>
      <div className="card-container">
        <Link to="/alerts" className="card">
          <h2>Alerts</h2>
          <p>View alerts for all parks</p>
        </Link>
        <Link to="/parks" className="card">
          <h2>Parks</h2>
          <p>Explore all the national parks</p>
        </Link>
        <Link to="/species" className="card">
          <h2>Species</h2>
          <p>View information about species</p>
        </Link>
        <Link to="/visitors" className="card">
          <h2>Visitors</h2>
          <p>See visitor data</p>
        </Link>
        <Link to="/organizations" className="card">
          <h2>Organizations</h2>
          <p>View organization information</p>
        </Link>
        <Link to="/projects" className="card">
          <h2>Preservation Projects</h2>
          <p>View preservation projects</p>
        </Link>
        <Link to="/pollutants" className="card">
          <h2>Pollutants</h2>
          <p>View pollutant data</p>
        </Link>
      </div>
    </div>
  );
}

