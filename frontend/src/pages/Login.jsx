import { useState } from "react";
import { loginUser } from "../api/index.js";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setMessage("Both fields are required.");
      return;
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_]{4,}$/.test(form.username)) {
      setMessage(
        "Username must start with a letter, be at least 5 characters, and contain only letters, numbers, or underscores."
      );
      return;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
        form.password
      )
    ) {
      setMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }     

    setLoading(true);
    try {
      const result = await loginUser(form);
      setMessage(`Welcome, ${result.username} (${result.role})!`);

      //Save session
      localStorage.setItem("session", JSON.stringify(result));

      //Admin role
      if (result.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setMessage(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <br />
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            style={{
              width: "70%",
              padding: "2px",
              backgroundColor: "#fff",
            }}
          />
        </div>

        <div>
          <label>Password:</label>
          <br />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            style={{
              width: "70%",
              padding: "2px",
              backgroundColor: "#fff",
            }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && <p style={{ marginTop: "1rem", color: "blue" }}>{message}</p>}
    </div>
  );
}

export default Login;
