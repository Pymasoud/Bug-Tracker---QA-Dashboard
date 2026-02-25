import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStats } from "../api/bugApi";
import {
  BugsPerSprintChart,
  BugTypeChart,
  StatusChart,
} from "../components/Charts";

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (err) {
        setError(err.message || "Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  // Safely support both the documented shape and the current backend implementation.
  const byStatus = stats?.by_status || stats?.status || {};
  const byPriority = stats?.by_priority || stats?.priority || {};
  const bySprint = stats?.by_sprint || stats?.sprint || {};
  const byBugType = stats?.by_bug_type || stats?.bug_type || {};

  const totalBugs = Object.values(byStatus).reduce(
    (sum, v) => sum + Number(v || 0),
    0
  );
  const openBugs = Number(byStatus.open || 0);
  const fixedBugs = Number(byStatus.fixed || 0);
  const highPriority = Number(byPriority.high || 0);

  const sprintData = Object.entries(bySprint).map(([name, count]) => ({
    sprint: name,
    count: Number(count || 0),
  }));

  const bugTypeData = Object.entries(byBugType).map(([type, count]) => ({
    type,
    count: Number(count || 0),
  }));

  const statusData = Object.entries(byStatus).map(([status, count]) => ({
    status,
    count: Number(count || 0),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-slate-100">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-slate-100"
        >
          <span className="mr-1">←</span> Back
        </Link>
      </div>

      <header className="mb-6 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-semibold text-slate-50">
          Bug Tracker Statistics
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          High-level overview of your bugs across sprints, types, and statuses.
        </p>
      </header>

      {loading && (
        <div className="rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
          Loading statistics...
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-md border border-red-700 bg-red-900/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && stats && (
        <>
          {/* Summary cards */}
          <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total Bugs
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-50">
                {totalBugs}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Open Bugs
              </p>
              <p className="mt-2 text-2xl font-semibold text-blue-400">
                {openBugs}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Fixed Bugs
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-400">
                {fixedBugs}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                High Priority
              </p>
              <p className="mt-2 text-2xl font-semibold text-red-400">
                {highPriority}
              </p>
            </div>
          </section>

          {/* Charts grid */}
          <section className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <BugsPerSprintChart data={sprintData} />
            </div>
            <div className="lg:col-span-1">
              <BugTypeChart data={bugTypeData} />
            </div>
            <div className="lg:col-span-1">
              <StatusChart data={statusData} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

