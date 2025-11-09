import { Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">National Parks</Link>
      <ul className="nav-links">
        <li>
          <Link to="/alerts">Alerts</Link>
        </li>
        <li>
          <Link to="/parks">Parks</Link>
        </li>
        <li>
          <Link to="/species">Species</Link>
        </li>
        <li>
          <Link to="/visitors">Visitors</Link>
        </li>
        <li>
          <Link to="/organizations">Organizations</Link>
        </li>
      </ul>
    </nav>
  );
}

