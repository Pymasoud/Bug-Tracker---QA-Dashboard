import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBugs, deleteBug } from "../api/bugApi";
import BugList from "../components/BugList";

export default function Dashboard() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  async function loadBugs({ status, priority } = {}) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBugs({
        status: status || undefined,
        priority: priority || undefined,
      });
      setBugs(data || []);
    } catch (err) {
      setError(err.message || "Failed to load bugs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBugs();
  }, []);

  async function handleFilterChange(nextStatus, nextPriority) {
    setStatusFilter(nextStatus);
    setPriorityFilter(nextPriority);
    await loadBugs({ status: nextStatus, priority: nextPriority });
  }

  async function handleDelete(id) {
    try {
      await deleteBug(id);
      await loadBugs({ status: statusFilter, priority: priorityFilter });
    } catch (err) {
      setError(err.message || "Failed to delete bug.");
    }
  }

  return (
    <div className="flex flex-col gap-3 border-b border-slate-800 pb-4">
      <header className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            BugTracker AI
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            View, filter, and manage all reported bugs. AI helps you prioritize
            with severity suggestions.
          </p>
        </div>
        <div style={{display: "flex", gap: "16px"}}>
          <Link
            to="/stats"
            style={{padding: "8px 16px", background: "#6366F1", color: "white", borderRadius: "6px", textDecoration: "none"}}
          >
            View Statistics
          </Link>
          <Link
            to="/add"
            style={{padding: "8px 16px", background: "#7C3AED", color: "white", borderRadius: "6px", textDecoration: "none"}}
          >
            Add Bug
          </Link>
        </div>
      </header>

      <section className="mt-6 rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div>
              <label
                htmlFor="statusFilter"
                className="block text-xs font-medium uppercase tracking-wide text-slate-300"
              >
                Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) =>
                  handleFilterChange(e.target.value, priorityFilter)
                }
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="fixed">Fixed</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="priorityFilter"
                className="block text-xs font-medium uppercase tracking-wide text-slate-300"
              >
                Priority
              </label>
              <select
                id="priorityFilter"
                value={priorityFilter}
                onChange={(e) =>
                  handleFilterChange(statusFilter, e.target.value)
                }
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="text-xs font-medium text-slate-400">
              Loading bugs...
            </div>
          )}
        </div>
      </section>

      {error && (
        <div className="mt-4 rounded-md border border-red-700 bg-red-900/40 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <BugList bugs={bugs} onDelete={handleDelete} />
    </div>
  );
}

