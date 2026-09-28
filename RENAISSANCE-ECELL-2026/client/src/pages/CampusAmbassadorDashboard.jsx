import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Compass,
  Copy,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  RefreshCw,
  Save,
  ShieldCheck,
  Tag,
  Users,
  X,
} from "lucide-react";
import { ambassadorApi } from "../lib/server1-api";
import { useSmoothScroll } from "../lib/smoothScroll";

async function loadPages(fetchPage, key) {
  let page = 1;
  const rows = [];
  let response;
  do {
    response = await fetchPage({ page, limit: 50 });
    rows.push(...response[key]);
    page += 1;
  } while (response.pagination.hasNextPage);
  return { ...response, [key]: rows };
}

const STATUS_OPTIONS = [
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

function statusLabel(status) {
  const match = STATUS_OPTIONS.find((s) => s.value === status);
  return match ? match.label : String(status || "").replaceAll("_", " ");
}

function formatDate(dateString) {
  if (!dateString) return "No due date set";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Pending";
  }
}

function formatFullDate(dateString) {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return String(dateString);
  }
}

// Modal dialog for editing task status, remarks, and completion details
function TaskUpdateModal({ task, isOpen, onClose, onSaved, handleAuthError }) {
  const dialogRef = useRef(null);
  const [status, setStatus] = useState(task?.status || "ASSIGNED");
  const [remarks, setRemarks] = useState(task?.remarks || "");
  const [completionDetails, setCompletionDetails] = useState(task?.completionDetails || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  if (!isOpen || !task) return null;

  const currentIndex = STATUS_OPTIONS.findIndex((s) => s.value === task.status);
  const availableStatuses = currentIndex >= 0 ? STATUS_OPTIONS.slice(currentIndex) : STATUS_OPTIONS;

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const response = await ambassadorApi.updateTask(task.taskId, {
        status,
        remarks: remarks.trim(),
        completionDetails: completionDetails.trim(),
      });
      const updated = response?.task || response;
      onSaved(updated);
      setSuccess(true);
    } catch (err) {
      if (!handleAuthError?.(err)) {
        setError(err.message || "Failed to update mission progress. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="ca-portal-modal-backdrop"
      onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }}
      aria-modal="true"
      aria-labelledby="task-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="ca-portal-modal">
        <div className="ca-modal-header">
          <div>
            <span className="ca-task-meta-left">{task.taskId}</span>
            <h3 id="task-modal-title" className="ca-modal-title">{task.title}</h3>
          </div>
          <button className="ca-modal-close" disabled={saving} onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="ca-modal-body">
            {task.description && (
              <div className="ca-form-group">
                <span className="ca-form-label">Instructions</span>
                <p className="ca-task-instructions">{task.description}</p>
              </div>
            )}

            {task.dueAt && (
              <div className="ca-form-group">
                <span className="ca-form-label">Due Date</span>
                <p className="ca-task-due" style={{ color: "#233F53", fontSize: "12px" }}>
                  <Calendar size={14} style={{ color: "#278DBB" }} /> {formatFullDate(task.dueAt)}
                </p>
              </div>
            )}

            <div className="ca-form-group">
              <label htmlFor="task-status-select" className="ca-form-label">Update Status</label>
              <select
                id="task-status-select"
                className="ca-form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving || task.status === "COMPLETED"}
              >
                {availableStatuses.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="ca-form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="task-remarks-input" className="ca-form-label">Remarks &amp; Updates</label>
                <span style={{ fontSize: "10px", color: "#607D8B" }}>{remarks.length}/2000</span>
              </div>
              <textarea
                id="task-remarks-input"
                className="ca-form-control"
                rows={3}
                maxLength={2000}
                placeholder="Share your progress or notes with the Renaissance team..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="ca-form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="task-completion-input" className="ca-form-label">Completion Proof / Links</label>
                <span style={{ fontSize: "10px", color: "#607D8B" }}>{completionDetails.length}/4000</span>
              </div>
              <textarea
                id="task-completion-input"
                className="ca-form-control"
                rows={3}
                maxLength={4000}
                placeholder="Links to posts, photos, drive files, or details of completion..."
                value={completionDetails}
                onChange={(e) => setCompletionDetails(e.target.value)}
                disabled={saving}
              />
            </div>

            {error && (
              <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#ffebee", color: "#b71c1c", fontSize: "12px", marginTop: "10px" }} role="alert">
                {error}
              </div>
            )}

            {success && (
              <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#e8f5e9", color: "#2e7d32", fontSize: "12px", marginTop: "10px" }} role="status">
                Mission details successfully saved!
              </div>
            )}
          </div>

          <div className="ca-modal-footer">
            <button type="button" className="ca-btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="ca-btn-primary" disabled={saving}>
              {saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? "Saving..." : "Save progress"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default function CampusAmbassadorDashboard() {
  const { ambassador, logout, loggingOut, handleAuthError } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollTo } = useSmoothScroll();

  const hashTab = location.hash.slice(1).toLowerCase();
  const currentTab = ["tasks", "promo"].includes(hashTab) ? hashTab : "overview";
  const [revision, setRevision] = useState(0);

  const [dashboardData, setDashboardData] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [taskFilter, setTaskFilter] = useState("ALL");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const switchTab = (tabName) => {
    setMobileMenuOpen(false);
    navigate({ hash: tabName });
    scrollTo(0, { immediate: true, force: true });
  };

  const loadAllData = () => { setLoading(true); setError(""); setRevision((n) => n + 1); };
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [dash, tasks, refs] = await Promise.all([
          ambassadorApi.dashboard(),
          loadPages(ambassadorApi.tasks, "tasks"),
          loadPages(ambassadorApi.referrals, "referrals"),
        ]);
        if (active) { setDashboardData(dash); setTaskData(tasks); setReferralData(refs); }
      } catch (err) {
        if (active && !handleAuthError(err)) setError(!err.status || err.status >= 500
          ? "The server is unavailable. Please try again."
          : err.message);
      } finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [revision, handleAuthError]);

  // Pick up admin assignments, reviews and promo edits without discarding an open task draft.
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") setRevision((n) => n + 1); };
    const timer = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    return () => { clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, []);

  // Update local task state when saved via modal
  const handleTaskSaved = (savedTask) => {
    setEditingTask(savedTask);
    if (!taskData?.tasks) return;
    const previous = taskData.tasks.find((t) => t.taskId === savedTask.taskId);
    setTaskData((current) => ({
      ...current,
      tasks: current.tasks.map((t) => (t.taskId === savedTask.taskId ? savedTask : t)),
    }));

    if (previous && previous.status !== savedTask.status && dashboardData?.taskStats) {
      const statusKeyMap = {
        ASSIGNED: "assigned",
        IN_PROGRESS: "inProgress",
        COMPLETED: "completed",
      };
      const oldKey = statusKeyMap[previous.status];
      const newKey = statusKeyMap[savedTask.status];
      setDashboardData((prev) => ({
        ...prev,
        taskStats: {
          ...prev.taskStats,
          [oldKey]: Math.max(0, (prev.taskStats[oldKey] || 0) - 1),
          [newKey]: (prev.taskStats[newKey] || 0) + 1,
        },
      }));
    }
  };

  const handleCopyPromo = async () => {
    const code = dashboardData?.promoCode?.code;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(""), 2200);
    } catch {
      setCopyFeedback("Copy unavailable. Select the code and copy it manually.");
    }
  };

  // Derived metrics
  const promoCode = dashboardData?.promoCode?.code || "NOT ASSIGNED";
  const registrationsCount = dashboardData?.referralStats?.total ?? 0;
  const verifiedRegistrations = dashboardData?.referralStats?.verified ?? 0;
  const totalTasks = dashboardData?.taskStats?.total ?? (taskData?.tasks?.length || 0);
  const completedTasks = dashboardData?.taskStats?.completed ?? 0;
  const activeTasks = totalTasks - completedTasks;
  const assignedTasksCount = dashboardData?.taskStats?.assigned ?? 0;
  const inProgressTasksCount = dashboardData?.taskStats?.inProgress ?? 0;

  const tasksList = taskData?.tasks || [];
  const referralsList = referralData?.referrals || [];

  // Filter tasks for the My Tasks tab
  const filteredTasks = taskFilter === "ALL" ? tasksList : tasksList.filter((t) => t.status === taskFilter);

  const firstName = ambassador?.name?.trim().split(" ")[0] || "Captain";
  const recentDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (6 - index));
    const day = date.toISOString().slice(0, 10);
    return {
      label: date.toLocaleDateString(undefined, { day: "numeric", month: "short", timeZone: "UTC" }),
      count: referralsList.filter((referral) => referral.createdAt?.slice(0, 10) === day).length,
      isPeach: index % 2 === 1,
    };
  });

  const maxDailyCount = Math.max(1, ...recentDays.map((d) => d.count));

  return (
    <div className="ca-dashboard-wrapper">
      {/* Mobile top toggle bar */}
      <div className="ca-mobile-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            className="ca-icon-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            aria-controls="ca-navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "800", fontSize: "14px" }}>
            RENAISSANCE 10.0
          </span>
        </div>
        <button className="ca-btn-secondary" onClick={logout} disabled={loggingOut} style={{ minHeight: "34px" }}>
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>

      {/* Ambassador navigation */}
      <aside className={`ca-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <Link to="/" className="ca-sidebar-brand" title="Back to Renaissance Home">
          <div className="ca-brand-badge">
            <Compass size={24} />
          </div>
          <div>
            <div className="ca-brand-title">RENAISSANCE</div>
            <span className="ca-brand-edition">10TH EDITION · AMBASSADOR</span>
          </div>
        </Link>

        <div className="ca-sidebar-section-title">Ambassador Space</div>

        <nav id="ca-navigation" className="ca-sidebar-nav" aria-label="Ambassador Navigation">
          <button
            type="button"
            className={`ca-nav-item ${currentTab === "overview" ? "active" : ""}`}
            onClick={() => switchTab("overview")}
            aria-current={currentTab === "overview" ? "page" : undefined}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
            {currentTab === "overview" && <span className="ca-nav-dot" />}
          </button>

          <button
            type="button"
            className={`ca-nav-item ${currentTab === "tasks" ? "active" : ""}`}
            onClick={() => switchTab("tasks")}
            aria-current={currentTab === "tasks" ? "page" : undefined}
          >
            <ClipboardList size={18} />
            <span>My tasks</span>
            {currentTab === "tasks" && <span className="ca-nav-dot" />}
          </button>

          <button
            type="button"
            className={`ca-nav-item ${currentTab === "promo" ? "active" : ""}`}
            onClick={() => switchTab("promo")}
            aria-current={currentTab === "promo" ? "page" : undefined}
          >
            <Tag size={18} />
            <span>Promo &amp; registrations</span>
            {currentTab === "promo" && <span className="ca-nav-dot" />}
          </button>

          <button
            type="button"
            className="ca-nav-item ca-nav-logout"
            onClick={logout}
            disabled={loggingOut}
          >
            {loggingOut ? <LoaderCircle size={18} className="animate-spin" /> : <LogOut size={18} />}
            <span>{loggingOut ? "Signing out..." : "Logout"}</span>
          </button>
        </nav>

        <div className="ca-sidebar-spacer" />

        {/* Logged in profile summary at sidebar bottom */}
        <div className="ca-sidebar-profile">
          <div className="ca-avatar-circle">
            {ambassador?.name ? ambassador.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="ca-profile-details">
            <div className="ca-profile-name" title={ambassador?.name}>
              {ambassador?.name || "Ambassador"}
            </div>
            <div className="ca-profile-badge">
              <ShieldCheck size={13} style={{ color: "#278DBB" }} />
              <span>Campus Ambassador</span>
            </div>
          </div>
        </div>

        <div className="ca-sidebar-footer">
          RENAISSANCE 10.0 · E-CELL MNNIT
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ca-content-area">
        {/* Top bar with Breadcrumbs & User Pill */}
        <div className="ca-top-bar">
          <div className="ca-breadcrumbs">
            <span>RENAISSANCE</span>
            <span>/</span>
            <span className="active">
              {currentTab === "overview"
                ? "AMBASSADOR PORTAL"
                : currentTab === "tasks"
                ? "MY TASKS"
                : "PROMO & REGISTRATIONS"}
            </span>
          </div>

          <div className="ca-top-actions">
            <button
              className="ca-icon-btn"
              onClick={loadAllData}
              disabled={loading}
              title="Refresh data"
              aria-label="Refresh data"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>

            <div className="ca-user-pill">
              <div className="ca-user-pill-avatar">
                {ambassador?.name ? ambassador.name.charAt(0).toUpperCase() : "A"}
              </div>
              <span>{ambassador?.name || "Ambassador"}</span>
            </div>

            <button
              className="ca-icon-btn"
              onClick={logout}
              disabled={loggingOut}
              title="Logout"
              aria-label="Logout"
            >
              {loggingOut ? <LoaderCircle size={16} className="animate-spin" /> : <LogOut size={16} />}
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div
            style={{
              padding: "14px 18px",
              background: "#ffe8dc",
              border: "1px solid #ebd3c5",
              borderRadius: "16px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#85533b",
              fontSize: "13px",
            }}
            role="alert"
          >
            <span>{error}</span>
            <button className="ca-btn-secondary" onClick={loadAllData} style={{ minHeight: "32px", padding: "4px 12px" }}>
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div className="ca-empty-box" style={{ margin: "40px 0" }}>
            <LoaderCircle size={32} className="ca-empty-icon animate-spin" />
            <h3 className="ca-empty-title">Loading Ambassador Command...</h3>
            <p className="ca-empty-text">Fetching your missions, registrations, and promo performance.</p>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {!loading && !error && dashboardData && currentTab === "overview" && (
          <div>
            {/* Welcome Banner */}
            <div className="ca-welcome-banner">
              <div>
                <div className="ca-welcome-eyebrow">YOUR AMBASSADOR DASHBOARD</div>
                <h1 className="ca-welcome-title">Welcome back, {firstName}.</h1>
                <p className="ca-welcome-subtitle">
                  Here is what is happening with your campus outreach for Renaissance 2026.
                </p>
              </div>

            </div>

            {/* 4 Metric Cards */}
            <div className="ca-metrics-grid">
              {/* Promo Code Card */}
              <div className="ca-card ca-card-peach ca-metric-card">
                <div>
                  <div className="ca-metric-header">
                    <span className="ca-metric-label">PROMO CODE</span>
                    <Tag size={18} className="ca-metric-icon" />
                  </div>
                  <div className="ca-metric-val ca-metric-val-code">{promoCode}</div>
                  <div className="ca-metric-desc">Share code with applicants</div>
                </div>
                <div className="ca-metric-action">
                  <button
                    className="ca-btn-text"
                    onClick={handleCopyPromo} disabled={!dashboardData?.promoCode}
                    style={{ color: "#8c5235" }}
                  >
                    <Copy size={14} />
                    <span aria-live="polite">{copyFeedback || "Copy code"}</span>
                  </button>
                </div>
              </div>

              {/* Registrations Card */}
              <div className="ca-card ca-card-sky ca-metric-card">
                <div>
                  <div className="ca-metric-header">
                    <span className="ca-metric-label">REGISTRATIONS</span>
                    <Users size={18} className="ca-metric-icon" />
                  </div>
                  <div className="ca-metric-val">{registrationsCount} <span style={{ fontSize: "16px", fontWeight: "600", color: "#607D8B" }}>people</span></div>
                  <div className="ca-metric-desc">Using your assigned codes</div>
                </div>
                <div className="ca-metric-action">
                  <span style={{ fontSize: "11px", color: "#278DBB", fontWeight: "700" }}>
                    {verifiedRegistrations} verified
                  </span>
                </div>
              </div>

              {/* Active Tasks Card */}
              <div className="ca-card ca-card-sky ca-metric-card">
                <div>
                  <div className="ca-metric-header">
                    <span className="ca-metric-label">ACTIVE TASKS</span>
                    <ClipboardList size={18} className="ca-metric-icon" />
                  </div>
                  <div className="ca-metric-val">{activeTasks} <span style={{ fontSize: "16px", fontWeight: "600", color: "#607D8B" }}>/ {totalTasks}</span></div>
                  <div className="ca-metric-desc">Assigned or in progress</div>
                </div>
                <div className="ca-metric-action">
                  <button className="ca-btn-text" onClick={() => switchTab("tasks")}>
                    <span>View tasks</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Completed Tasks Card */}
              <div className="ca-card ca-card-peach ca-metric-card">
                <div>
                  <div className="ca-metric-header">
                    <span className="ca-metric-label">COMPLETED</span>
                    <CheckCircle2 size={18} className="ca-metric-icon" />
                  </div>
                  <div className="ca-metric-val">{completedTasks} <span style={{ fontSize: "16px", fontWeight: "600", color: "#607D8B" }}>/ {totalTasks}</span></div>
                  <div className="ca-metric-desc">Tasks marked complete</div>
                </div>
                <div className="ca-metric-action">
                  <span style={{ fontSize: "11px", color: "#85533b", fontWeight: "700" }}>
                    {totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% progress` : "Ready"}
                  </span>
                </div>
              </div>
            </div>

            {/* Two-Column Area: Assigned Tasks & Code Performance */}
            <div className="ca-overview-cols">
              {/* Left Column: Assigned Tasks */}
              <div className="ca-card ca-card-sky ca-column-card">
                <div className="ca-column-header">
                  <div>
                    <span className="ca-task-meta-left">YOUR NEXT MOVES</span>
                    <h2 className="ca-column-title">Assigned tasks</h2>
                  </div>
                  <button className="ca-btn-text" onClick={() => switchTab("tasks")}>
                    <span>View all</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {tasksList.length === 0 ? (
                  <div className="ca-empty-box">
                    <ClipboardList size={30} className="ca-empty-icon" />
                    <div className="ca-empty-title">No tasks assigned yet</div>
                    <p className="ca-empty-text">Your campus outreach missions will appear here once assigned.</p>
                  </div>
                ) : (
                  <div className="ca-tasks-list">
                    {tasksList.slice(0, 3).map((task) => (
                      <div key={task.taskId} className="ca-task-item">
                        <div className="ca-task-meta">
                          <div className="ca-task-meta-left">
                            <span>MISSION</span>
                            {task.dueAt && (
                              <span className="ca-task-due">
                                · <Calendar size={12} /> {formatDate(task.dueAt)}
                              </span>
                            )}
                          </div>
                          <span className={`ca-status-badge ${task.status.toLowerCase()}`}>
                            {statusLabel(task.status)}
                          </span>
                        </div>

                        <h3 className="ca-task-title">{task.title}</h3>
                        {task.description && (
                          <p className="ca-task-instructions">{task.description}</p>
                        )}

                        {task.reviewFeedback && <p className="ca-task-remark"><strong>Admin feedback:</strong> {task.reviewFeedback}</p>}
                        {task.remarks && (
                          <div className="ca-task-remark">
                            <strong>Your remark:</strong> {task.remarks}
                          </div>
                        )}

                        <div className="ca-task-footer">
                          <button
                            className="ca-btn-text"
                            onClick={() => setEditingTask(task)}
                          >
                            <span>Update</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Code Performance */}
              <div className="ca-card ca-card-peach ca-column-card">
                <div className="ca-column-header">
                  <div>
                    <span className="ca-task-meta-left" style={{ color: "#85533b" }}>CODE PERFORMANCE</span>
                    <h2 className="ca-column-title">Registrations</h2>
                  </div>
                </div>

                <div style={{ marginTop: "4px" }}>
                  <div style={{ fontSize: "36px", fontWeight: "900", color: "#233F53" }}>
                    {registrationsCount}
                  </div>
                  <p style={{ fontSize: "12px", color: "#607D8B", marginTop: "2px" }}>
                    registrations across your assigned codes
                  </p>
                </div>

                {/* 7-Day Performance Bar Chart */}
                <div className="ca-chart-container">
                  {recentDays.map((item, idx) => {
                    const heightPercent = maxDailyCount > 0 ? (item.count / maxDailyCount) * 90 : 0;
                    return (
                      <div key={idx} className="ca-chart-bar-wrap">
                        <div
                          className={`ca-chart-bar ${item.isPeach ? "peach" : ""}`}
                          style={{ height: `${heightPercent}%` }}
                          title={`${item.count} registrations`}
                        />
                        <span className="ca-chart-day">{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
                  <span style={{ fontSize: "10px", fontWeight: "800", color: "#85533b", letterSpacing: "1.2px" }}>
                    RECENT 7 DAYS
                  </span>
                  <button className="ca-btn-text" onClick={() => switchTab("promo")} style={{ color: "#85533b" }}>
                    <span>View breakdown</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY TASKS */}
        {!loading && !error && dashboardData && currentTab === "tasks" && (
          <div>
            <div className="ca-welcome-banner">
              <div>
                <div className="ca-welcome-eyebrow">AMBASSADOR WORKSPACE</div>
                <h1 className="ca-welcome-title">My tasks.</h1>
                <p className="ca-welcome-subtitle">
                  Update your mission progress and leave remarks for the Renaissance organizing team.
                </p>
              </div>

              <div className="ca-progress-pill">
                {completedTasks} OF {totalTasks} COMPLETE
              </div>
            </div>

            <div className="ca-card ca-card-sky" style={{ padding: "26px", borderRadius: "22px" }}>
              <div className="ca-board-header">
                <div>
                  <span className="ca-task-meta-left">TASK BOARD</span>
                  <h2 className="ca-column-title" style={{ fontSize: "20px" }}>Assigned to you</h2>
                </div>

                <div className="ca-filter-group">
                  {[
                    { id: "ALL", label: `All (${totalTasks})` },
                    { id: "ASSIGNED", label: `Assigned (${assignedTasksCount})` },
                    { id: "IN_PROGRESS", label: `In Progress (${inProgressTasksCount})` },
                    { id: "COMPLETED", label: `Completed (${completedTasks})` },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      className={`ca-filter-btn ${taskFilter === filter.id ? "active" : ""}`}
                      onClick={() => setTaskFilter(filter.id)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="ca-empty-box">
                  <ClipboardList size={34} className="ca-empty-icon" />
                  <div className="ca-empty-title">
                    {taskFilter === "ALL" ? "No tasks assigned yet" : `No ${statusLabel(taskFilter)} tasks`}
                  </div>
                  <p className="ca-empty-text">
                    {taskFilter === "ALL"
                      ? "The Renaissance team will assign outreach missions to your portal."
                      : `You currently have no tasks marked as ${statusLabel(taskFilter)}.`}
                  </p>
                </div>
              ) : (
                <div className="ca-tasks-list">
                  {filteredTasks.map((task) => (
                    <div key={task.taskId} className="ca-task-item">
                      <div className="ca-task-meta">
                        <div className="ca-task-meta-left">
                          <span>{task.taskId}</span>
                          {task.dueAt && (
                            <span className="ca-task-due">
                              · <Calendar size={12} /> Due {formatFullDate(task.dueAt)}
                            </span>
                          )}
                        </div>
                        <span className={`ca-status-badge ${task.status.toLowerCase()}`}>
                          {statusLabel(task.status)}
                        </span>
                      </div>

                      <h3 className="ca-task-title">{task.title}</h3>
                      {task.description && (
                        <p className="ca-task-instructions">{task.description}</p>
                      )}

                      {task.reviewFeedback && <p className="ca-task-remark"><strong>Admin feedback:</strong> {task.reviewFeedback}</p>}
                        {task.remarks && (
                        <div className="ca-task-remark">
                          <strong>Your remark:</strong> {task.remarks}
                        </div>
                      )}

                      {task.completionDetails && (
                        <div className="ca-task-remark" style={{ borderLeftColor: "#37624c", background: "#f3f8f5" }}>
                          <strong>Completion proof:</strong> {task.completionDetails}
                        </div>
                      )}

                      <div className="ca-task-footer">
                        <button
                          className="ca-btn-primary"
                          onClick={() => setEditingTask(task)}
                          style={{ minHeight: "34px", padding: "6px 14px", fontSize: "12px" }}
                        >
                          <span>Update progress</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PROMO & REGISTRATIONS */}
        {!loading && !error && dashboardData && currentTab === "promo" && (
          <div>
            <div className="ca-welcome-banner">
              <div>
                <div className="ca-welcome-eyebrow">YOUR REACH</div>
                <h1 className="ca-welcome-title">Promo &amp; registrations.</h1>
                <p className="ca-welcome-subtitle">
                  Every registration through your unique promo code is permanently linked to your profile.
                </p>
              </div>
            </div>

            <div className="ca-promo-grid">
              {/* Promo Code Card */}
              <div className="ca-card ca-card-peach ca-promo-card">
                <img
                  src="/pirate-wheel-half.png"
                  alt=""
                  aria-hidden="true"
                  className="ca-promo-wheel-art"
                />
                <div>
                  <span className="ca-task-meta-left" style={{ color: "#85533b" }}>
                    YOUR UNIQUE PROMO CODE
                  </span>
                  <div className="ca-promo-code-display">{promoCode}</div>
                  <p className="ca-promo-desc">
                    {dashboardData.promoCode ? `${dashboardData.promoCode.registrationCount} registrations with this code. Share it when promoting Renaissance events.` : "Your promo code has not been assigned yet. Contact the Renaissance team for help."}
                  </p>
                </div>

                <div>
                  <button className="ca-btn-primary" onClick={handleCopyPromo} disabled={!dashboardData?.promoCode}>
                    <Copy size={16} />
                    <span aria-live="polite">{copyFeedback || "Copy promo code"}</span>
                  </button>
                </div>
              </div>

              {/* Code Usage Card */}
              <div className="ca-card ca-card-sky" style={{ padding: "28px", borderRadius: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <span className="ca-task-meta-left">CODE USAGE</span>
                  <div style={{ fontSize: "40px", fontWeight: "900", color: "#233F53", margin: "10px 0 2px" }}>
                    {registrationsCount}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#233F53" }}>
                    Total registrations
                  </div>
                  <p style={{ fontSize: "11px", color: "#607D8B", marginTop: "2px" }}>
                    Across your assigned promo codes
                  </p>
                </div>

                <div style={{ borderTop: "1px solid var(--ca-border)", paddingTop: "16px", marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "9px", fontWeight: "800", color: "#607D8B", letterSpacing: "1px" }}>VERIFIED</span>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#37624c" }}>{verifiedRegistrations}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "9px", fontWeight: "800", color: "#607D8B", letterSpacing: "1px" }}>PENDING</span>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#85533b" }}>{dashboardData.referralStats.pendingVerification}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "9px", fontWeight: "800", color: "#607D8B", letterSpacing: "1px" }}>STATUS</span>
                    <div style={{ fontSize: "14px", fontWeight: "800", color: "#278DBB", marginTop: "2px" }}>{statusLabel(dashboardData.promoCode?.effectiveStatus || "NOT_ASSIGNED")}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Breakdown Table */}
            <div className="ca-card ca-card-white ca-breakdown-card">
              <div className="ca-column-header">
                <div>
                  <span className="ca-task-meta-left">RECENT ACTIVITY</span>
                  <h2 className="ca-column-title" style={{ fontSize: "20px" }}>Registration breakdown</h2>
                </div>
                <span className="ca-progress-pill" style={{ background: "#dff1fc" }}>
                  {referralsList.length} ATTRIBUTED
                </span>
              </div>

              {referralsList.length === 0 ? (
                <div className="ca-empty-box" style={{ background: "#f8fbfd" }}>
                  <Users size={34} className="ca-empty-icon" />
                  <div className="ca-empty-title">Your crew is yet to arrive</div>
                  <p className="ca-empty-text">
                    No registrations under {promoCode} yet. Share your promo code with your college communities to get started.
                  </p>
                </div>
              ) : (
                <div className="ca-table-responsive">
                  <table className="ca-data-table">
                    <thead>
                      <tr>
                        <th>Registration ID</th>
                        <th>Participant</th>
                        <th>Package</th>
                        <th>Promo Code</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralsList.map((ref) => (
                        <tr key={ref.id || ref.registrationId}>
                          <td style={{ fontFamily: "monospace", fontWeight: "700", color: "#278DBB" }}>
                            {ref.registrationId}
                          </td>
                          <td style={{ fontWeight: "600" }}>{ref.participantName || "Anonymous Participant"}</td>
                          <td>{ref.packageName || ref.packageCode || "General Pass"}</td>
                          <td style={{ fontFamily: "monospace", color: "#8c5235" }}>{ref.promoCode || promoCode}</td>
                          <td style={{ color: "#607D8B" }}>{formatDate(ref.createdAt)}</td>
                          <td>
                            <span
                              className={`ca-status-badge ${
                                String(ref.status).toLowerCase().includes("verified") ? "completed" : "assigned"
                              }`}
                            >
                              {statusLabel(ref.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Task Update Modal Dialog */}
      {editingTask && <TaskUpdateModal
        key={editingTask.taskId}
        task={editingTask}
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onSaved={handleTaskSaved}
        handleAuthError={handleAuthError}
      />}
    </div>
  );
}
