import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from "./home";
import PostForm from "./PostForm";
import Profile from "./Profile";
import Navbar from "./Navbar";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Define Routes */}
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<><Navbar /><Home /></>} />
          <Route path="/profile" element={<><Navbar /><Profile /></>} />
          <Route path="/upload" element={<PostForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;