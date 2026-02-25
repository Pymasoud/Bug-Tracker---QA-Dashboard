import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// 1. Bugs per sprint bar chart
// Expects data like: [{ sprint: "Sprint-1", count: 5 }, ...]
export function BugsPerSprintChart({ data = [] }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-100">
        Bugs per Sprint
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="sprint"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={{ stroke: "#4b5563" }}
            tickLine={{ stroke: "#4b5563" }}
            angle={-30}
            textAnchor="end"
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={{ stroke: "#4b5563" }}
            tickLine={{ stroke: "#4b5563" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderColor: "#1f2937",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Legend
            wrapperStyle={{ color: "#e5e7eb", fontSize: 12 }}
            iconType="circle"
          />
          <Bar
            dataKey="count"
            name="Bugs"
            fill="#6366F1"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Colors for bug types
const BUG_TYPE_COLORS = [
  "#6366F1",
  "#22D3EE",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#A855F7",
];

// 2. Bug type pie chart
// Expects data like: [{ type: "crash", count: 3 }, ...]
export function BugTypeChart({ data = [] }) {
  const total = data.reduce((sum, d) => sum + (d.count || 0), 0) || 1;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-100">
        Bugs by Type
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderColor: "#1f2937",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#e5e7eb" }}
            formatter={(value, name) => [`${value}`, name]}
          />
          <Legend
            wrapperStyle={{ color: "#e5e7eb", fontSize: 12 }}
            iconType="circle"
          />
          <Pie
            data={data}
            dataKey="count"
            nameKey="type"
            outerRadius={100}
            labelLine={false}
            label={(entry) => {
              const percent = ((entry.count || 0) / total) * 100;
              return `${entry.type} (${percent.toFixed(0)}%)`;
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.type}-${index}`}
                fill={BUG_TYPE_COLORS[index % BUG_TYPE_COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Status colors
const STATUS_COLORS = {
  open: "#6366F1",
  fixed: "#10B981",
  closed: "#94A3B8",
  in_progress: "#F59E0B",
};

// 3. Status bar chart
// Expects data like: [{ status: "open", count: 4 }, ...]
export function StatusChart({ data = [] }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-100">
        Bugs by Status
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="status"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={{ stroke: "#4b5563" }}
            tickLine={{ stroke: "#4b5563" }}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={{ stroke: "#4b5563" }}
            tickLine={{ stroke: "#4b5563" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderColor: "#1f2937",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Legend
            wrapperStyle={{ color: "#e5e7eb", fontSize: 12 }}
            iconType="circle"
          />
          <Bar dataKey="count" name="Bugs" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.status}-${index}`}
                fill={STATUS_COLORS[entry.status] || "#6366F1"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

