import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={styles.page}>
      <style>
        {`
          .focusflow-nav-link {
            transition: color 0.2s ease;
          }

          .focusflow-nav-link:hover {
            color: #2563eb !important;
          }

          .focusflow-logout:hover {
            background: #f8fafc !important;
          }

          .focusflow-card {
            transition: box-shadow 0.2s ease, transform 0.2s ease;
          }

          .focusflow-card:hover {
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
            transform: translateY(-1px);
          }

          @media (max-width: 700px) {
            .focusflow-header {
              height: auto !important;
              min-height: 72px !important;
              padding: 16px 20px !important;
              gap: 16px !important;
              align-items: flex-start !important;
            }

            .focusflow-nav {
              gap: 14px !important;
              flex-wrap: wrap;
              justify-content: flex-end;
            }

            .focusflow-nav-link {
              font-size: 13px !important;
            }

            .focusflow-container {
              padding: 45px 20px !important;
            }

            .focusflow-title {
              font-size: 34px !important;
            }

            .focusflow-subtitle {
              font-size: 15px !important;
            }

            .focusflow-card {
              padding: 24px !important;
            }
          }

          @media (max-width: 480px) {
            .focusflow-header {
              flex-direction: column;
              align-items: stretch !important;
            }

            .focusflow-nav {
              justify-content: flex-start !important;
            }

            .focusflow-container {
              padding: 38px 18px !important;
            }

            .focusflow-title {
              font-size: 30px !important;
            }
          }
        `}
      </style>

      <header
        className="focusflow-header"
        style={styles.header}
      >
        <Link to="/dashboard" style={styles.logo}>
          FocusFlow
        </Link>

        <nav
          className="focusflow-nav"
          style={styles.nav}
        >
          <Link
            to="/dashboard"
            className="focusflow-nav-link"
            style={styles.activeNavLink}
          >
            Dashboard
          </Link>

          <Link
            to="/projects"
            className="focusflow-nav-link"
            style={styles.navLink}
          >
            Projects
          </Link>

          <Link
            to="/tasks"
            className="focusflow-nav-link"
            style={styles.navLink}
          >
            Tasks
          </Link>

          <button
            onClick={logout}
            className="focusflow-logout"
            style={styles.logout}
          >
            Sign out
          </button>
        </nav>
      </header>

      <main
        className="focusflow-container"
        style={styles.container}
      >
        <section style={styles.hero}>
          <p style={styles.eyebrow}>DASHBOARD</p>

          <h1
            className="focusflow-title"
            style={styles.title}
          >
            Welcome back
          </h1>

          <p
            className="focusflow-subtitle"
            style={styles.subtitle}
          >
            Manage your projects, organize your tasks, and stay focused on
            what matters.
          </p>
        </section>

        <section style={styles.grid}>
          <Link
            to="/projects"
            className="focusflow-card"
            style={styles.card}
          >
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                Projects
              </h2>

              <span style={styles.arrow}>→</span>
            </div>

            <p style={styles.cardText}>
              Organize your work into focused projects and keep everything
              structured in one place.
            </p>

            <span style={styles.cardLink}>
              Manage projects
            </span>
          </Link>

          <Link
            to="/tasks"
            className="focusflow-card"
            style={styles.card}
          >
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                Tasks
              </h2>

              <span style={styles.arrow}>→</span>
            </div>

            <p style={styles.cardText}>
              Create, manage, and track tasks so you always know what needs
              to be done next.
            </p>

            <span style={styles.cardLink}>
              Manage tasks
            </span>
          </Link>
        </section>

        <section style={styles.account}>
          <div>
            <p style={styles.accountLabel}>
              SIGNED IN AS
            </p>

            <p style={styles.accountEmail}>
              {user?.email}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    color: "#0f172a",
  },

  header: {
    height: "72px",
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 48px",
  },

  logo: {
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    color: "#2563eb",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },

  navLink: {
    textDecoration: "none",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
  },

  activeNavLink: {
    textDecoration: "none",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: "600",
  },

  logout: {
    background: "transparent",
    border: "1px solid #cbd5e1",
    color: "#334155",
    padding: "9px 16px",
    borderRadius: "7px",
    fontSize: "14px",
    cursor: "pointer",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "64px 32px",
  },

  hero: {
    marginBottom: "48px",
  },

  eyebrow: {
    margin: "0 0 12px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "#2563eb",
  },

  title: {
    margin: "0",
    fontSize: "42px",
    fontWeight: "700",
    letterSpacing: "-1.2px",
    color: "#0f172a",
  },

  subtitle: {
    maxWidth: "650px",
    marginTop: "14px",
    fontSize: "17px",
    lineHeight: "1.6",
    color: "#64748b",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },

  card: {
    display: "block",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "32px",
    textDecoration: "none",
    color: "#0f172a",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    margin: "0",
    fontSize: "22px",
    fontWeight: "600",
  },

  arrow: {
    fontSize: "22px",
    color: "#2563eb",
  },

  cardText: {
    marginTop: "16px",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#64748b",
  },

  cardLink: {
    display: "inline-block",
    marginTop: "22px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#2563eb",
  },

  account: {
    marginTop: "48px",
    padding: "24px 0",
    borderTop: "1px solid #e2e8f0",
  },

  accountLabel: {
    margin: "0 0 6px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.2px",
    color: "#94a3b8",
  },

  accountEmail: {
    margin: "0",
    fontSize: "14px",
    color: "#475569",
  },
};

export default Dashboard;