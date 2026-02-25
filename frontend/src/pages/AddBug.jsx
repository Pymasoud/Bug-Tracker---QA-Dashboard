import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBug } from "../api/bugApi";

export default function AddBug() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [bugType, setBugType] = useState("other");
  const [sprint, setSprint] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successSeverity, setSuccessSeverity] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccessSeverity(null);

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        priority,
        bug_type: bugType,
        sprint: sprint.trim() || null,
      };

      const created = await createBug(payload);

      setSuccessSeverity(created?.ai_suggested_severity || "Pending");

      // Navigate back to the dashboard after a short delay so the user
      // can see the AI severity suggestion.
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to create bug.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 text-slate-100">
      <h1 className="text-2xl font-semibold text-slate-50">Add New Bug</h1>
      <p className="mt-1 text-sm text-slate-400">
        Capture a new bug report. Severity will be suggested automatically by AI.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-lg border border-slate-700 bg-slate-900 p-5 shadow-lg"
      >
        {error && (
          <div className="rounded-md border border-red-700 bg-red-900/40 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {successSeverity && (
          <div className="rounded-md border border-emerald-700 bg-emerald-900/40 px-3 py-2 text-sm text-emerald-100">
            Bug created successfully. AI suggested severity:{" "}
            <span className="font-semibold">{successSeverity}</span>.
            Redirecting to dashboard...
          </div>
        )}

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-200"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Short summary of the bug"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-200"
          >
            Description
          </label>
          <textarea
            id="description"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Steps to reproduce, expected vs actual behavior, environment, etc."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-slate-200"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="bug_type"
              className="block text-sm font-medium text-slate-200"
            >
              Bug Type
            </label>
            <select
              id="bug_type"
              value={bugType}
              onChange={(e) => setBugType(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="crash">Crash</option>
              <option value="ui">UI</option>
              <option value="performance">Performance</option>
              <option value="logic">Logic</option>
              <option value="security">Security</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="sprint"
            className="block text-sm font-medium text-slate-200"
          >
            Sprint
          </label>
          <input
            id="sprint"
            type="text"
            value={sprint}
            onChange={(e) => setSprint(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g. Sprint-1"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 transition-colors duration-150"
          >
            {isSubmitting ? "Creating..." : "Create Bug"}
          </button>
        </div>
      </form>
    </div>
  );
}

