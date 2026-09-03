import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProjects = async () => {
    try {
      setError("");

      const response = await api.get("/projects");
      setProjects(response.data.projects);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      setError("");
      setCreating(true);

      const response = await api.post("/projects", {
        name,
        description,
      });

      setProjects((currentProjects) => [
        response.data.project,
        ...currentProjects,
      ]);

      setName("");
      setDescription("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to create project."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setDeletingId(projectId);

      await api.delete(`/projects/${projectId}`);

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project.id !== projectId
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to delete project."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        .projects-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 32px;
        }

        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .project-card {
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }

        .project-card:hover {
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
          transform: translateY(-2px);
        }

        .create-button:hover:not(:disabled) {
          background: #1d4ed8 !important;
        }

        .view-tasks:hover {
          color: #1d4ed8 !important;
        }

        .delete-button:hover:not(:disabled) {
          color: #b91c1c !important;
        }

        @media (max-width: 700px) {
          .projects-header {
            padding: 0 20px !important;
          }

          .projects-container {
            padding: 40px 20px;
          }

          .project-grid {
            grid-template-columns: 1fr;
          }

          .page-title {
            font-size: 32px !important;
          }

          .create-section {
            padding: 24px !important;
          }
        }

        @media (max-width: 520px) {
          .projects-header {
            height: auto !important;
            min-height: 64px;
            padding-top: 16px !important;
            padding-bottom: 16px !important;
          }

          .projects-logo {
            font-size: 21px !important;
          }

          .back-link {
            font-size: 13px !important;
          }

          .projects-container {
            padding: 32px 16px;
          }

          .page-title {
            font-size: 29px !important;
          }

          .page-subtitle {
            font-size: 15px !important;
          }

          .create-section {
            padding: 20px !important;
          }

          .project-card {
            padding: 20px !important;
          }

          .actions {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 14px;
          }
        }
      `}</style>

      <header
        className="projects-header"
        style={styles.header}
      >
        <Link
          to="/dashboard"
          className="projects-logo"
          style={styles.logo}
        >
          FocusFlow
        </Link>

        <Link
          to="/dashboard"
          className="back-link"
          style={styles.backLink}
        >
          Back to Dashboard
        </Link>
      </header>

      <main className="projects-container">
        <section style={styles.pageIntro}>
          <p style={styles.eyebrow}>PROJECTS</p>

          <h1
            className="page-title"
            style={styles.title}
          >
            Your Projects
          </h1>

          <p
            className="page-subtitle"
            style={styles.subtitle}
          >
            Organize your work and keep everything you need
            in one place.
          </p>
        </section>

        <section
          className="create-section"
          style={styles.createSection}
        >
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Create a project
              </h2>

              <p style={styles.sectionDescription}>
                Start by giving your project a name and
                description.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreate}
            style={styles.form}
          >
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Project name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter project name"
                style={styles.input}
                disabled={creating}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe what this project is about"
                style={styles.textarea}
                rows="4"
                disabled={creating}
              />
            </div>

            <button
              type="submit"
              className="create-button"
              style={{
                ...styles.createButton,
                opacity: creating ? 0.7 : 1,
                cursor: creating
                  ? "not-allowed"
                  : "pointer",
              }}
              disabled={creating}
            >
              {creating
                ? "Creating project..."
                : "Create Project"}
            </button>
          </form>
        </section>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <section style={styles.projectsSection}>
          <div style={styles.projectsHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                All Projects
              </h2>

              <p style={styles.sectionDescription}>
                {projects.length}{" "}
                {projects.length === 1
                  ? "project"
                  : "projects"}
              </p>
            </div>
          </div>

          {loading ? (
            <div style={styles.emptyState}>
              <p>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div style={styles.emptyState}>
              <h3 style={styles.emptyTitle}>
                No projects yet
              </h3>

              <p style={styles.emptyText}>
                Create your first project using the form
                above.
              </p>
            </div>
          ) : (
            <div className="project-grid">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="project-card"
                  style={styles.projectCard}
                >
                  <div style={styles.projectContent}>
                    <h3 style={styles.projectName}>
                      {project.name}
                    </h3>

                    <p style={styles.projectDescription}>
                      {project.description ||
                        "No description provided."}
                    </p>
                  </div>

                  <div
                    className="actions"
                    style={styles.actions}
                  >
                    <Link
                      to={`/tasks?project_id=${project.id}`}
                      className="view-tasks"
                      style={styles.viewTasks}
                    >
                      View Tasks
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(project.id)
                      }
                      className="delete-button"
                      style={{
                        ...styles.deleteButton,
                        opacity:
                          deletingId === project.id
                            ? 0.6
                            : 1,
                        cursor:
                          deletingId === project.id
                            ? "not-allowed"
                            : "pointer",
                      }}
                      disabled={
                        deletingId === project.id
                      }
                    >
                      {deletingId === project.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
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
    boxSizing: "border-box",
  },

  logo: {
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "700",
    color: "#2563eb",
    letterSpacing: "-0.5px",
  },

  backLink: {
    textDecoration: "none",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "500",
  },

  pageIntro: {
    marginBottom: "40px",
  },

  eyebrow: {
    margin: "0 0 10px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "#2563eb",
  },

  title: {
    margin: "0",
    fontSize: "38px",
    fontWeight: "700",
    letterSpacing: "-1px",
  },

  subtitle: {
    marginTop: "12px",
    color: "#64748b",
    fontSize: "16px",
    lineHeight: "1.6",
    maxWidth: "650px",
  },

  createSection: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "32px",
    marginBottom: "40px",
  },

  sectionHeader: {
    marginBottom: "24px",
  },

  sectionTitle: {
    margin: "0",
    fontSize: "20px",
    fontWeight: "600",
    color: "#0f172a",
  },

  sectionDescription: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  form: {
    maxWidth: "700px",
  },

  formGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
    outline: "none",
  },

  createButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "7px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "14px 16px",
    borderRadius: "8px",
    marginBottom: "30px",
    fontSize: "14px",
  },

  projectsSection: {
    marginTop: "10px",
  },

  projectsHeader: {
    marginBottom: "20px",
  },

  projectCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "180px",
    boxSizing: "border-box",
  },

  projectContent: {
    flex: 1,
  },

  projectName: {
    margin: "0 0 10px",
    fontSize: "19px",
    fontWeight: "600",
  },

  projectDescription: {
    margin: "0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "24px",
    paddingTop: "18px",
    borderTop: "1px solid #f1f5f9",
  },

  viewTasks: {
    textDecoration: "none",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: "600",
    transition: "color 0.2s ease",
  },

  deleteButton: {
    background: "transparent",
    border: "none",
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },

  emptyState: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "50px 30px",
    textAlign: "center",
  },

  emptyTitle: {
    margin: "0",
    fontSize: "18px",
    fontWeight: "600",
  },

  emptyText: {
    marginTop: "8px",
    color: "#64748b",
    fontSize: "14px",
  },
};

export default Projects;