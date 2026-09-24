import { Link } from 'react-router-dom'
import './Navbar.css'

interface NavbarProps {
  user: any
  onLogout: () => void
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🔐</span>
          ProNet
        </Link>
        <ul className="nav-menu">
          <li>
            <Link to="/jobs">Jobs</Link>
          </li>
          <li>
            <Link to={`/profile/${user.username}`}>Profile</Link>
          </li>
          <li>
            <Link to="/messages">Messages</Link>
          </li>
          <li>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
