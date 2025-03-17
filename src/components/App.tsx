import RegistrationForm from "./registrationForm/RegistrationForm";
import LoginForm from "./loginForm/LoginForm";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./home";
import PostForm from "./postModal/PostFormModal";
import Profile from "./profile/Profile";
import Navbar from "./navbar/Navbar";
import AI from "./ai/AI";
import AboutUs from "./AboutUs";
import Challenges from "./Challenges";
// import backgroundImage from "../../pictures/bg.jpeg"

const App = () => {
  return (
    <Router>
      <div
        className="d-flex flex-column min-vh-100"
        style={{
          // backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <div className="flex-grow-1">
          <Routes>
            {/* Define Routes */}
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
              path="/home"
              element={
                <>
                  <Navbar />
                  <Home />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Navbar />
                  <Profile />
                </>
              }
            />
            <Route
              path="/ai"
              element={
                <>
                  <Navbar />
                  <AI />
                </>
              }
            />
            <Route
              path="/challenges"
              element={
                <>
                  <Navbar />
                  <Challenges />
                </>
              }
            />
            <Route
              path="/aboutUs"
              element={
                <>
                  <Navbar />
                  <AboutUs />
                </>
              }
            />
            <Route
              path="/upload"
              element={
                <PostForm
                  show={false}
                  handleClose={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  onPostAdded={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
