
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Language {
  id: string;
  name: string;
  family?: string;
}

interface FeatureValueChartProps {
  languages: Language[];
}

function getFamilyDistribution(languages: Language[]) {
  const familyMap: { [family: string]: number } = {};
  for (const lang of languages) {
    const fam = lang.family || "Unknown";
    familyMap[fam] = (familyMap[fam] || 0) + 1;
  }
  // Convert to array and sort descending by count
  return Object.entries(familyMap)
    .map(([family, count]) => ({ family, count }))
    .sort((a, b) => b.count - a.count);
}

const FeatureValueChart: React.FC<FeatureValueChartProps> = ({ languages }) => {
  const data = getFamilyDistribution(languages);
  if (data.length === 0) return null;

  return (
    <div className="w-36 h-24 flex-shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <XAxis type="number" hide />
          <YAxis
            dataKey="family"
            type="category"
            width={64}
            tick={{ fontSize: 9 }}
            stroke="#888"
          />
          <Bar dataKey="count" fill="#9b87f5" radius={[4, 4, 4, 4]} />
          <Tooltip
            contentStyle={{ background: "#fff", fontSize: "11px", borderRadius: "6px" }}
            itemStyle={{ color: "#403E43" }}
            labelFormatter={label => `Family: ${label}`}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureValueChart;
