// Small pill-shaped status badge for bug status values.
// Uses TailwindCSS utility classes for colors and layout.

const STATUS_STYLES = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-800",
  fixed: "bg-green-100 text-green-700",
  closed: "bg-gray-200 text-gray-700",
};

export default function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();
  const colorClasses = STATUS_STYLES[normalized] || "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colorClasses}`}
    >
      {normalized || "unknown"}
    </span>
  );
}

