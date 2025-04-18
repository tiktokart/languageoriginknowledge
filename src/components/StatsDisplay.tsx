
import { Language } from '@/lib/walsData';
import { getFamilyColor } from '@/utils/languageColors';

interface StatsDisplayProps {
  languages: Language[];
}

export const StatsDisplay = ({ languages }: StatsDisplayProps) => {
  const familyCounts: Record<string, number> = {};
  languages.forEach(lang => {
    if (!familyCounts[lang.family]) {
      familyCounts[lang.family] = 0;
    }
    familyCounts[lang.family]++;
  });
  
  const topFamilies = Object.entries(familyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
    
  return (
    <div className="fixed right-0 bottom-0 p-4 bg-black/70 backdrop-blur-md rounded-tl-lg text-white max-w-xs">
      <h3 className="text-lg font-semibold mb-2">Language Stats</h3>
      <div className="text-sm">
        <p>Total languages: {languages.length}</p>
        <p>Families: {Object.keys(familyCounts).length}</p>
        
        <h4 className="mt-2 mb-1 font-medium">Top Language Families:</h4>
        <ul className="space-y-1">
          {topFamilies.map(([family, count]) => (
            <li key={family} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getFamilyColor(family) }}
              />
              <span>{family}: {count} languages</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
