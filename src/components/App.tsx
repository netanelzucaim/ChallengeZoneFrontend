import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import ImgComponent from "./img"
import PostLists from "./PostsList"

const App = () => {
  return (
    <Router>
      <div className="app-container">

        <Routes>
          {/* Define Routes */}
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          {/* Default Route */}
          {/* <Route path="/" element={<Navigate to="/login" />} /> */}
          <Route path="/" element={<PostLists />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
