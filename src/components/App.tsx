import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from "./home";
import PostForm from "./PostFormModal";
import Profile from "./Profile";
import Navbar from "./Navbar";
import AI from "./AI";
import backgroundImage from "../../pictures/bg.jpeg"

const App = () => {
  return (
    <Router>
      <div
        className="d-flex flex-column min-vh-100"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          width: "100vw"
        }}
      >
      <div className="flex-grow-1">
        <Routes>
          {/* Define Routes */}
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<><Navbar /><Home /></>} />
          <Route path="/profile" element={<><Navbar /><Profile /></>} />
          <Route path="/ai" element={<><Navbar /><AI /></>} />
          <Route path="/upload" element={<PostForm />} />
        </Routes>
      </div>
      </div>
    </Router>
  );
};

export default App;