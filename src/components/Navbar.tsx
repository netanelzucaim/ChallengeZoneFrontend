import { Link, useNavigate } from 'react-router-dom';
import userService from '../services/user_service';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await userService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">Challenge Zone</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ai">Chat</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/challenges">Challenges</Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
          <li className="nav-item">
              <Link className="btn btn-link nav-link" to="/aboutUs">About Us</Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;