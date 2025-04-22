import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Language } from "@/lib/walsData";

interface FeatureValueChartProps {
  languagesGroupedByValue: Record<string, Language[]>;
  onBarClick?: (value: string, languages: Language[]) => void;
}

// More visually distinct color palette if needed
const COLORS = [
  "#9b87f5", "#7E69AB", "#6E59A5", "#F2FCE2", "#FEF7CD", "#FEC6A1", "#FFDEE2",
  "#FDE1D3", "#D3E4FD", "#8B5CF6", "#F97316", "#0EA5E9", "#D946EF", "#E5DEFF"
];

function getSortedValueData(languagesGroupedByValue: Record<string, Language[]>): {
  value: string;
  count: number;
}[] {
  // Value = feature's possible values (e.g. "Small", "Large", "Very Large (>14)")
  // Count = number of languages with that value
  return Object.entries(languagesGroupedByValue)
    .map(([value, langs]) => ({
      value,
      count: langs.length,
    }))
    .sort((a, b) => b.count - a.count);
}

const FeatureValueChart: React.FC<FeatureValueChartProps> = ({
  languagesGroupedByValue,
  onBarClick,
}) => {
  if (!languagesGroupedByValue || !Object.keys(languagesGroupedByValue).length) return null;

  const data = getSortedValueData(languagesGroupedByValue);

  // Find max count for X axis
  const maxValue = data.length ? Math.max(...data.map((item) => item.count)) : 1;

  return (
    <div className="w-full h-64 flex-shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
          onClick={e => {
            if (!onBarClick || !e?.activeLabel) return;
            const value = e.activeLabel;
            if (languagesGroupedByValue[value]) {
              onBarClick(value, languagesGroupedByValue[value]);
            }
          }}
        >
          <XAxis
            type="number"
            dataKey="count"
            domain={[0, maxValue]}
            tick={{ fontSize: 12 }}
            stroke="#888"
            label={{
              value: "Number of Languages with Value",
              position: "insideBottom",
              offset: -5,
              fill: "#555"
            }}
          />
          <YAxis
            type="category"
            dataKey="value"
            width={130}
            tick={{ fontSize: 13 }}
            stroke="#888"
            label={{
              value: "Feature Value",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: 'middle' },
              fill: "#555"
            }}
          />
          <Bar dataKey="count" isAnimationActive={false}
            onClick={(_, idx) => {
              if (!onBarClick) return;
              const value = data[idx].value;
              if (languagesGroupedByValue[value]) {
                onBarClick(value, languagesGroupedByValue[value]);
              }
            }}>
            {data.map((entry, idx) => (
              <Cell key={entry.value} fill={COLORS[idx % COLORS.length]} cursor={onBarClick ? "pointer" : "default"} />
            ))}
            <LabelList dataKey="count" position="right" fontSize={11} fill="#333" />
          </Bar>
          <Tooltip
            contentStyle={{
              background: "#fff",
              fontSize: "12px",
              borderRadius: "6px",
              color: "#333",
            }}
            itemStyle={{ color: "#403E43" }}
            formatter={(value, name, props) => [`${value}`, "No. of Languages"]}
            labelFormatter={label => `Value: ${label}`}
          />
        </BarChart>
      </ResponsiveContainer>
      {onBarClick && (
        <div className="text-xs text-center mt-2 text-slate-600">Click a bar to see all languages for a value</div>
      )}
    </div>
  );
};

export default FeatureValueChart;
