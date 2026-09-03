import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Login failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f6f8fb",
      padding: "24px",
      boxSizing: "border-box",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },

    card: {
      width: "100%",
      maxWidth: "430px",
      background: "#ffffff",
      border: "1px solid #e6eaf0",
      borderRadius: "16px",
      padding: "40px",
      boxSizing: "border-box",
      boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
    },

    logo: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#2563eb",
      marginBottom: "36px",
      textAlign: "center",
      letterSpacing: "-0.5px",
    },

    eyebrow: {
      fontSize: "12px",
      fontWeight: "700",
      color: "#64748b",
      letterSpacing: "1.2px",
      marginBottom: "8px",
      textTransform: "uppercase",
      textAlign: "center",
    },

    title: {
      fontSize: "30px",
      fontWeight: "700",
      color: "#0f172a",
      margin: "0 0 10px",
      textAlign: "center",
      letterSpacing: "-0.8px",
    },

    subtitle: {
      fontSize: "15px",
      color: "#64748b",
      margin: "0 0 30px",
      textAlign: "center",
      lineHeight: "1.6",
    },

    field: {
      marginBottom: "20px",
    },

    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#334155",
      marginBottom: "8px",
    },

    input: {
      width: "100%",
      padding: "13px 14px",
      border: "1px solid #dbe1e8",
      borderRadius: "9px",
      fontSize: "15px",
      color: "#0f172a",
      background: "#ffffff",
      boxSizing: "border-box",
      outline: "none",
    },

    error: {
      background: "#fef2f2",
      border: "1px solid #fecaca",
      color: "#b91c1c",
      borderRadius: "8px",
      padding: "12px 14px",
      fontSize: "14px",
      marginBottom: "20px",
    },

    button: {
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "9px",
      background: "#2563eb",
      color: "#ffffff",
      fontSize: "15px",
      fontWeight: "600",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
      marginTop: "4px",
    },

    footer: {
      textAlign: "center",
      marginTop: "26px",
      paddingTop: "24px",
      borderTop: "1px solid #eef1f5",
      fontSize: "14px",
      color: "#64748b",
    },

    link: {
      color: "#2563eb",
      fontWeight: "600",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>FocusFlow</div>

        <div style={styles.eyebrow}>Welcome back</div>

        <h1 style={styles.title}>Sign in to your account</h1>

        <p style={styles.subtitle}>
          Stay organized, focused, and in control of your work.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>

            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>

            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            style={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;