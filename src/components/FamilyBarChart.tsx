
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

// A good palette for distinct families (max 12 colors)
const COLORS = [
  "#6E59A5",
  "#9b87f5",
  "#F97316",
  "#0EA5E9",
  "#8B5CF6",
  "#FFDEE2",
  "#F2FCE2",
  "#FEF7CD",
  "#D3E4FD",
  "#D946EF",
  "#E5DEFF",
  "#33C3F0",
];

interface FamilyBarChartProps {
  languages: { family?: string }[];
}

function getFamilyCounts(languages: { family?: string }[]) {
  const counts: Record<string, number> = {};
  for (const lang of languages) {
    const fam = lang.family ?? "Unknown";
    counts[fam] = (counts[fam] || 0) + 1;
  }
  // Sort families by count descending. Optionally limit to 12.
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([family, count]) => ({
      family,
      count,
    }))
    .slice(0, 12);
}

const FamilyBarChart: React.FC<FamilyBarChartProps> = ({ languages }) => {
  const data = getFamilyCounts(languages);

  if (!data.length) return null;

  return (
    <div className="w-full h-64 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <XAxis
            dataKey="family"
            type="category"
            tick={{ fontSize: 11, fill: "#7E69AB" }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
            stroke="#888"
            label={{ value: "Language Family", position: "insideBottom", offset: -5, fill: "#555" }}
          />
          <YAxis
            dataKey="count"
            tick={{ fontSize: 12 }}
            allowDecimals={false}
            stroke="#888"
            label={{ value: "Number of Languages", angle: -90, position: "insideLeft", style: { textAnchor: 'middle' }, fill: "#555" }}
          />
          <Bar dataKey="count">
            {data.map((entry, idx) => (
              <Cell key={entry.family} fill={COLORS[idx % COLORS.length]} />
            ))}
            <LabelList dataKey="count" position="top" fontSize={11} fill="#222" />
          </Bar>
          <Tooltip
            contentStyle={{
              background: "#fff",
              fontSize: "12px",
              borderRadius: "6px",
              color: "#333",
            }}
            itemStyle={{ color: "#403E43" }}
            formatter={value => [`${value}`, "No. of Languages"]}
            labelFormatter={label => `Family: ${label}`}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FamilyBarChart;
