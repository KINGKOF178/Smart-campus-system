import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Buildings from "./pages/Buildings";
import Floors from "./pages/Floors";
import Rooms from "./pages/Rooms";
import Devices from "./pages/Devices";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <Routes>
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/buildings"
    element={
      <ProtectedRoute>
        <Buildings />
      </ProtectedRoute>
    }
  />

  <Route
    path="/floors"
    element={
      <ProtectedRoute>
        <Floors />
      </ProtectedRoute>
    }
  />

  <Route
    path="/rooms"
    element={
      <ProtectedRoute>
        <Rooms />
      </ProtectedRoute>
    }
  />

  <Route
    path="/devices"
    element={
      <ProtectedRoute>
        <Devices />
      </ProtectedRoute>
    }
  />

  <Route
    path="/reports"
    element={
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    }
  />
</Routes>
<Footer />
      </div>
    </div>
  );
}

export default App;