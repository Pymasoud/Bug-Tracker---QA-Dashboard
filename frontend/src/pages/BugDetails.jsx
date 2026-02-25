import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBug, updateBug } from "../api/bugApi";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";

export default function BugDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    async function loadBug() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBug(id);
        setBug(data);
      } catch (err) {
        setError(err.message || "Failed to load bug.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadBug();
    }
  }, [id]);

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    if (!bug || !newStatus || newStatus === bug.status) return;

    setStatusUpdating(true);
    setError(null);
    try {
      const updated = await updateBug(bug.id, { status: newStatus });
      setBug(updated);
    } catch (err) {
      setError(err.message || "Failed to update status.");
    } finally {
      setStatusUpdating(false);
    }
  }

  function formatDate(value) {
    if (!value) return "Unknown";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return String(value);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 text-slate-100">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mb-4 text-sm font-medium text-slate-300 hover:text-slate-100"
      >
        ← Back
      </button>

      {loading && (
        <div className="rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
          Loading bug details...
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-700 bg-red-900/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && bug && (
        <div className="space-y-6 rounded-lg border border-slate-800 bg-slate-900 p-5">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-50">
                #{bug.id} — {bug.title}
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Created at {formatDate(bug.created_at)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={bug.status} />
              <PriorityBadge priority={bug.priority} />
              <div className="text-xs text-slate-300 capitalize">
                Type: <span className="font-medium">{bug.bug_type}</span>
              </div>
            </div>
          </header>

          <section>
            <h2 className="text-sm font-semibold text-slate-200">
              Description
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
              {bug.description}
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Sprint
              </h3>
              <p className="text-sm text-slate-200">
                {bug.sprint || "Not assigned"}
              </p>

              <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                AI Suggested Severity
              </h3>
              <p className="text-sm text-slate-200">
                {bug.ai_suggested_severity || "Pending"}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </h3>
              <select
                value={bug.status}
                onChange={handleStatusChange}
                disabled={statusUpdating}
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="fixed">Fixed</option>
                <option value="closed">Closed</option>
              </select>
              {statusUpdating && (
                <p className="mt-1 text-xs text-slate-400">
                  Updating status...
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

