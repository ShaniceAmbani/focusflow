import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

function Tasks() {
  const [searchParams] = useSearchParams();
  const selectedProjectId = searchParams.get("project_id");

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [projectId, setProjectId] = useState(
    selectedProjectId || ""
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data.projects);

      if (!projectId && response.data.projects.length > 0) {
        setProjectId(String(response.data.projects[0].id));
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to load projects."
      );
    }
  };

  const fetchTasks = async () => {
    try {
      setError("");

      const response = await api.get("/tasks");
      setTasks(response.data.tasks);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    if (!projectId) {
      setError("Please select a project.");
      return;
    }

    try {
      setError("");
      setCreating(true);

      const response = await api.post("/tasks", {
        title,
        description,
        status,
        priority,
        project_id: Number(projectId),
      });

      setTasks((currentTasks) => [
        response.data.task,
        ...currentTasks,
      ]);

      setTitle("");
      setDescription("");
      setStatus("pending");
      setPriority("medium");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to create task."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setError("");
      setUpdatingId(taskId);

      const response = await api.put(`/tasks/${taskId}`, {
        status: newStatus,
      });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? response.data.task
            : task
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to update task."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setDeletingId(taskId);

      await api.delete(`/tasks/${taskId}`);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== taskId
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to delete task."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getProjectName = (id) => {
    const project = projects.find(
      (project) => project.id === id
    );

    return project?.name || "Unknown project";
  };

  const formatStatus = (value) => {
    if (value === "in_progress") {
      return "In Progress";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const formatPriority = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div style={styles.page}>
      <style>
        {`
          .focusflow-task-card {
            transition: box-shadow 0.2s ease, transform 0.2s ease;
          }

          .focusflow-task-card:hover {
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
            transform: translateY(-1px);
          }

          .focusflow-button {
            transition: background 0.2s ease;
          }

          .focusflow-button:hover:not(:disabled) {
            background: #1d4ed8 !important;
          }

          .focusflow-delete:hover:not(:disabled) {
            color: #b91c1c !important;
          }

          .focusflow-nav-link {
            transition: color 0.2s ease;
          }

          .focusflow-nav-link:hover {
            color: #2563eb !important;
          }

          @media (max-width: 800px) {
            .focusflow-header {
              padding: 0 24px !important;
            }

            .focusflow-container {
              padding: 45px 24px !important;
            }

            .focusflow-form-row {
              flex-direction: column !important;
              gap: 0 !important;
            }

            .focusflow-task-card {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 22px !important;
            }

            .focusflow-task-actions {
              justify-content: space-between !important;
              border-top: 1px solid #f1f5f9;
              padding-top: 18px;
            }
          }

          @media (max-width: 600px) {
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
              padding: 38px 18px !important;
            }

            .focusflow-title {
              font-size: 32px !important;
            }

            .focusflow-subtitle {
              font-size: 15px !important;
            }

            .focusflow-create-section {
              padding: 22px !important;
            }

            .focusflow-task-card {
              padding: 20px !important;
            }

            .focusflow-task-actions {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 16px !important;
            }

            .focusflow-status-wrapper {
              width: 100%;
            }

            .focusflow-status-select {
              width: 100%;
            }

            .focusflow-delete {
              align-self: flex-start;
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

        <nav className="focusflow-nav" style={styles.nav}>
          <Link
            to="/dashboard"
            className="focusflow-nav-link"
            style={styles.navLink}
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
            style={styles.activeNavLink}
          >
            Tasks
          </Link>
        </nav>
      </header>

      <main
        className="focusflow-container"
        style={styles.container}
      >
        <section style={styles.pageIntro}>
          <p style={styles.eyebrow}>TASKS</p>

          <h1
            className="focusflow-title"
            style={styles.title}
          >
            Your Tasks
          </h1>

          <p
            className="focusflow-subtitle"
            style={styles.subtitle}
          >
            Keep track of your work and stay on top of your priorities.
          </p>
        </section>

        <section
          className="focusflow-create-section"
          style={styles.createSection}
        >
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Create a task
            </h2>

            <p style={styles.sectionDescription}>
              Add a task and assign it to a project.
            </p>
          </div>

          <form onSubmit={handleCreate} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Task title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter task title"
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
                placeholder="Describe what needs to be done"
                style={styles.textarea}
                rows="4"
                disabled={creating}
              />
            </div>

            <div
              className="focusflow-form-row"
              style={styles.formRow}
            >
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Project
                </label>

                <select
                  value={projectId}
                  onChange={(event) =>
                    setProjectId(event.target.value)
                  }
                  style={styles.select}
                  disabled={creating}
                  required
                >
                  <option value="">
                    Select a project
                  </option>

                  {projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value)
                  }
                  style={styles.select}
                  disabled={creating}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  style={styles.select}
                  disabled={creating}
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="focusflow-button"
              style={{
                ...styles.createButton,
                opacity: creating ? 0.7 : 1,
                cursor: creating
                  ? "not-allowed"
                  : "pointer",
              }}
              disabled={creating}
            >
              {creating ? "Creating task..." : "Create Task"}
            </button>
          </form>
        </section>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <section style={styles.tasksSection}>
          <div style={styles.tasksHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                All Tasks
              </h2>

              <p style={styles.sectionDescription}>
                {tasks.length}{" "}
                {tasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>
          </div>

          {loading ? (
            <div style={styles.emptyState}>
              <p>Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div style={styles.emptyState}>
              <h3 style={styles.emptyTitle}>
                No tasks yet
              </h3>

              <p style={styles.emptyText}>
                Create your first task using the form above.
              </p>
            </div>
          ) : (
            <div style={styles.taskList}>
              {tasks.map((task) => (
                <article
                  key={task.id}
                  className="focusflow-task-card"
                  style={styles.taskCard}
                >
                  <div style={styles.taskMain}>
                    <div style={styles.taskTop}>
                      <h3 style={styles.taskTitle}>
                        {task.title}
                      </h3>

                      <span
                        style={{
                          ...styles.priority,
                          ...(task.priority === "high"
                            ? styles.highPriority
                            : task.priority === "low"
                            ? styles.lowPriority
                            : styles.mediumPriority),
                        }}
                      >
                        {formatPriority(task.priority)}
                      </span>
                    </div>

                    <p style={styles.taskDescription}>
                      {task.description ||
                        "No description provided."}
                    </p>

                    <p style={styles.projectName}>
                      {getProjectName(task.project_id)}
                    </p>
                  </div>

                  <div
                    className="focusflow-task-actions"
                    style={styles.taskActions}
                  >
                    <div className="focusflow-status-wrapper">
                      <label style={styles.statusLabel}>
                        Status
                      </label>

                      <select
                        value={task.status}
                        onChange={(event) =>
                          handleStatusChange(
                            task.id,
                            event.target.value
                          )
                        }
                        className="focusflow-status-select"
                        style={{
                          ...styles.statusSelect,
                          opacity:
                            updatingId === task.id ? 0.7 : 1,
                          cursor:
                            updatingId === task.id
                              ? "not-allowed"
                              : "pointer",
                        }}
                        disabled={updatingId === task.id}
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="in_progress">
                          In Progress
                        </option>

                        <option value="completed">
                          Completed
                        </option>
                      </select>
                    </div>

                    <button
                      onClick={() =>
                        handleDelete(task.id)
                      }
                      className="focusflow-delete"
                      style={{
                        ...styles.deleteButton,
                        opacity:
                          deletingId === task.id ? 0.6 : 1,
                        cursor:
                          deletingId === task.id
                            ? "not-allowed"
                            : "pointer",
                      }}
                      disabled={deletingId === task.id}
                    >
                      {deletingId === task.id
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
  },

  logo: {
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "700",
    color: "#2563eb",
    letterSpacing: "-0.5px",
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

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "60px 32px",
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
  },

  sectionDescription: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  form: {
    maxWidth: "850px",
  },

  formGroup: {
    marginBottom: "20px",
    flex: 1,
  },

  formRow: {
    display: "flex",
    gap: "18px",
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

  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: "#ffffff",
    fontSize: "14px",
    color: "#334155",
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

  tasksSection: {
    marginTop: "10px",
  },

  tasksHeader: {
    marginBottom: "20px",
  },

  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  taskCard: {
    position: "relative",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
  },

  taskMain: {
    flex: 1,
    minWidth: 0,
  },

  taskTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  taskTitle: {
    margin: "0",
    fontSize: "18px",
    fontWeight: "600",
  },

  taskDescription: {
    margin: "10px 0 8px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  projectName: {
    margin: "0",
    color: "#94a3b8",
    fontSize: "13px",
  },

  priority: {
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: "5px",
    fontSize: "11px",
    fontWeight: "700",
  },

  highPriority: {
    background: "#fef2f2",
    color: "#dc2626",
  },

  mediumPriority: {
    background: "#eff6ff",
    color: "#2563eb",
  },

  lowPriority: {
    background: "#f1f5f9",
    color: "#64748b",
  },

  taskActions: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  statusLabel: {
    display: "block",
    marginBottom: "6px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
  },

  statusSelect: {
    padding: "9px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
  },

  deleteButton: {
    border: "none",
    background: "transparent",
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
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

export default Tasks;