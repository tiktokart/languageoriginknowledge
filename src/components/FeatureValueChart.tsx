
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Updated color palette for top 10 languages
const COLORS = [
  "#9b87f5", // Primary Purple
  "#7E69AB", // Secondary Purple
  "#6E59A5", // Tertiary Purple
  "#F2FCE2", // Soft Green
  "#FEF7CD", // Soft Yellow
  "#FEC6A1", // Soft Orange
  "#FFDEE2", // Soft Pink
  "#FDE1D3", // Soft Peach
  "#D3E4FD", // Soft Blue
  "#8B5CF6", // Vivid Purple
];

interface Language {
  id: string;
  name: string;
  family?: string;
}

interface FeatureValueChartProps {
  languages: Language[];
}

function getTopLanguages(languages: Language[], limit = 10) {
  // Top 10 by number of occurrences. As this receives only related langs, we just sort by name.
  // For real data you might want something more meaningful.
  const sorted = [...languages].sort((a, b) => a.name.localeCompare(b.name));
  return sorted.slice(0, limit);
}

const FeatureValueChart: React.FC<FeatureValueChartProps> = ({ languages }) => {
  if (!languages.length) return null;

  // Group languages by family to count them
  const familyCounts: Record<string, number> = {};
  languages.forEach((lang) => {
    const family = lang.family || "Unknown";
    familyCounts[family] = (familyCounts[family] || 0) + 1;
  });

  const data = getTopLanguages(languages).map((lang, idx) => ({
    id: lang.id,
    name: lang.name,
    family: lang.family ?? "Unknown",
    idx,
    // Use the family count (number of related languages) as the value
    value: familyCounts[lang.family ?? "Unknown"] || 1,
  }));

  // Find the maximum value for domain scaling
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="w-full h-64 flex-shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
          <XAxis 
            type="number" 
            domain={[0, maxValue]} 
            tick={{ fontSize: 12 }}
            stroke="#888"
            label={{ value: "Number of Languages in Family", position: "insideBottom", offset: -5, fill: "#555" }}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={120}
            tick={{ fontSize: 12 }}
            stroke="#888"
            label={{ value: "Language Name", angle: -90, position: "insideLeft", style: { textAnchor: 'middle' }, fill: "#555" }}
          />
          <Bar 
            dataKey="value" 
            isAnimationActive={false} 
            label={{ 
              position: "right", 
              fill: "#333", 
              fontSize: 10,
              formatter: (value: number) => `${value}`
            }}
          >
            {data.map((entry, idx) => (
              <Cell key={entry.id} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
          <Tooltip
            contentStyle={{ background: "#fff", fontSize: "12px", borderRadius: "6px" }}
            itemStyle={{ color: "#403E43" }}
            labelFormatter={label => `Language: ${label}`}
            formatter={(value, name, props) => {
              // Show language and family
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const payload = (props && (props as any).payload) || {};
              return [`${value} languages in family`, `Family: ${payload.family ?? ""}`];
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureValueChart;
