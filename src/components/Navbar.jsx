import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm px-4"
      style={{
        background: "linear-gradient(90deg, #0d6efd, #2563eb)",
      }}
    >
      <div className="container-fluid">
        <h4 className="text-white fw-bold mb-0">
          ⚡ Smart Campus Energy Management System
        </h4>

        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-light btn-sm me-3"
            onClick={toggleDarkMode}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <div className="d-flex align-items-center text-white me-3">
            <FaUserCircle size={30} className="me-2" />
            <span className="fw-semibold">Administrator</span>
          </div>

          <button
            className="btn btn-danger btn-sm"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;