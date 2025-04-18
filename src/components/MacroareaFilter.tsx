
import { useState } from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MacroareaFilterProps {
  selectedArea: string | null;
  setSelectedArea: (area: string | null) => void;
}

export const MacroareaFilter = ({
  selectedArea,
  setSelectedArea
}: MacroareaFilterProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const areas = ["Africa", "Europe", "Asia", "North America", "South America", "Oceania"];
  
  return (
    <div className="bg-black/70 rounded-lg backdrop-blur-md border border-white/10 shadow-xl text-white w-fit">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="p-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filter by Region</h3>
          <CollapsibleTrigger className="rounded-full hover:bg-white/10 p-1 transition-colors">
            {isOpen ? (
              <MinusCircle className="h-5 w-5 text-white/80" />
            ) : (
              <PlusCircle className="h-5 w-5 text-white/80" />
            )}
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="px-3 pb-3 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedArea(null)}
              className={`px-3 py-1.5 rounded-full text-sm family-filter transition-colors ${
                selectedArea === null ? 'bg-white text-black font-medium' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              All Regions
            </button>
            {areas.map(area => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1.5 rounded-full text-sm family-filter transition-colors ${
                  selectedArea === area ? 'bg-white text-black font-medium' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
