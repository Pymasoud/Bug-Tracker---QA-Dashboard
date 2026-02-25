// Small pill-shaped priority badge for bug priority values.
// Uses TailwindCSS utility classes for colors and layout.

const PRIORITY_STYLES = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-700",
};

export default function PriorityBadge({ priority }) {
  const normalized = (priority || "").toLowerCase();
  const colorClasses =
    PRIORITY_STYLES[normalized] || "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colorClasses}`}
    >
      {normalized || "unknown"}
    </span>
  );
}

