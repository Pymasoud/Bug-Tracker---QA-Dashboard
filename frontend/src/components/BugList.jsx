import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";

export default function BugList({ bugs, onDelete }) {
  if (!bugs || bugs.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900 px-4 py-6 text-center text-sm text-slate-400">
        No bugs found.
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-slate-700 bg-slate-900">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-800">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">
              ID
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">
              Title
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">
              Status
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">
              Priority
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">
              Bug Type
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">
              Sprint
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">
              AI Severity
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-900">
          {bugs.map((bug) => (
            <tr
              key={bug.id}
              className="hover:bg-slate-800 transition-colors duration-150"
            >
              <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-200">
                {bug.id}
              </td>
              <td className="max-w-xs px-3 py-3 text-sm font-medium text-slate-100">
                <span className="line-clamp-2">{bug.title}</span>
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-sm">
                <StatusBadge status={bug.status} />
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-sm">
                <PriorityBadge priority={bug.priority} />
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-200 capitalize">
                {bug.bug_type}
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-300">
                {bug.sprint || "—"}
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-sm text-slate-200">
                {bug.ai_suggested_severity || "Pending"}
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-right text-sm">
                <div className="inline-flex items-center gap-2">
                  <Link
                    to={`/bug/${bug.id}`}
                    className="rounded-md bg-slate-700 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-600 transition-colors duration-150"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete?.(bug.id)}
                    className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-500 transition-colors duration-150"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

