import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } else {
      alert("❌ Invalid username or password");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0b5ed7, #198754)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "420px",
          borderRadius: "20px",
          border: "none", 
        }}
      >
        <div className="text-center mb-4">
          <h1 style={{ fontSize: "60px" }}>🏫</h1>
          <h2 className="fw-bold">
  Smart Campus
</h2>
          <p className="text-secondary">
  Energy Management System
</p>
        </div>

        <input
          className="form-control mb-3 rounded-pill"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <input
          className="form-control mb-3 rounded-pill"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button
  className="btn btn-primary w-100 py-2 rounded-pill"
  onClick={handleLogin}
>
  🔓 Sign In
</button>

        <div className="alert alert-info mt-4 text-center">
          <strong>Demo Login</strong>
          <br />
          Username: <strong>admin</strong>
          <br />
          Password: <strong>admin123</strong>
        </div>
      </div>
      <p className="text-center text-muted mt-3 mb-0">
  © 2026 Smart Campus EMS
</p>
    </div>
  );
}

export default Login;