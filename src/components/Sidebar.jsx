import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="text-center mb-3">
        <h2>🏫 Smart Campus</h2>
        <small>Energy Management System</small>
      </div>

      <hr />

      <NavLink to="/dashboard">🏠 Dashboard</NavLink>
      <NavLink to="/buildings">🏢 Buildings</NavLink>
      <NavLink to="/floors">🏬 Floors</NavLink>
      <NavLink to="/rooms">🚪 Rooms</NavLink>
      <NavLink to="/devices">💻 Devices</NavLink>
      <NavLink to="/reports">📊 Reports</NavLink>
    </div>
  );
}

export default Sidebar;