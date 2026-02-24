import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authService.login(form);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleLogin}>
        <h2 style={styles.title}>Admin Login</h2>

        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button style={styles.button}>Login</button>
      </form>
    </div>
  );
};

export default Login;

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px", // ⭐ chuẩn tablet
    background: "#fff",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },

  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#1976d2",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
