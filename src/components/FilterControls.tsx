
import { getFamilyColor } from '@/utils/languageColors';

interface FilterControlsProps {
  families: string[];
  selectedFamily: string | null;
  onSelectFamily: (family: string | null) => void;
  onZoomToFamily: (family: string) => void;
}

export const FilterControls = ({ 
  families, 
  selectedFamily, 
  onSelectFamily,
  onZoomToFamily 
}: FilterControlsProps) => {
  return (
    <div className="fixed left-0 top-0 p-4 bg-black/70 backdrop-blur-md rounded-br-lg text-white z-50">
      <h3 className="text-lg font-semibold mb-2">Filter by Family</h3>
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => onSelectFamily(null)}
          className={`px-2 py-1 rounded text-sm ${selectedFamily === null ? 'bg-white text-black' : 'bg-white/20'}`}
        >
          All
        </button>
        {families.map(family => (
          <button 
            key={family}
            onClick={() => {
              onSelectFamily(family);
              onZoomToFamily(family);
            }}
            className={`px-2 py-1 rounded text-sm ${selectedFamily === family ? 'bg-white text-black' : 'bg-white/20'}`}
            style={{ 
              borderColor: getFamilyColor(family),
              borderWidth: 2,
              borderStyle: 'solid'
            }}
          >
            {family}
          </button>
        ))}
      </div>
    </div>
  );
};
