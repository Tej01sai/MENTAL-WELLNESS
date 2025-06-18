import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post("/register", {
        username,
        password
      });
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setMessage("");
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Register</h2>
      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "0.5rem" }}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "0.5rem" }}
      />
      <button
        onClick={handleRegister}
        style={{
          padding: "0.7rem 1.2rem",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          width: "100%"
        }}
      >
        Register
      </button>
      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
};

export default Register;
