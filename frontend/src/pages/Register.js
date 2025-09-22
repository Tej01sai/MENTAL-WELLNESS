import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const calcStrength = (pwd) => {
  let s = 0;
  if (!pwd) return 0;
  if (pwd.length >= 8) s += 25;
  if (/[A-Z]/.test(pwd)) s += 25;
  if (/[0-9]/.test(pwd)) s += 25;
  if (/[^A-Za-z0-9]/.test(pwd)) s += 25;
  return s;
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://mental-wellness-production.up.railway.app/register", {
        username,
        email,
        phone,
        password
      });
      setMsg(res.data.message);
      navigate("/login");
    } catch (err) {
      setMsg("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setStrength(calcStrength(e.target.value)); }}
            placeholder="Password"
            required
          />
          <div className="w-full h-2 bg-gray-200 rounded">
            <div className="h-2 rounded" style={{ width: `${strength}%`, background: strength>66? '#16a34a': strength>33? '#f59e0b': '#ef4444' }} />
          </div>
          <button
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition"
            type="submit"
          >
            Register
          </button>
          {msg && <p className="text-center text-sm text-blue-500">{msg}</p>}
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account? <a href="/login" className="text-green-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
