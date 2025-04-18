
interface MacroareaFilterProps {
  selectedArea: string | null;
  setSelectedArea: (area: string | null) => void;
}

export const MacroareaFilter = ({
  selectedArea,
  setSelectedArea
}: MacroareaFilterProps) => {
  const areas = ["Africa", "Europe", "Asia", "North America", "South America", "Oceania"];
  
  return (
    <div className="fixed left-0 bottom-0 p-4 bg-black/70 backdrop-blur-md rounded-tr-lg text-white">
      <h3 className="text-lg font-semibold mb-2">Filter by Region</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedArea(null)}
          className={`px-2 py-1 rounded text-sm family-filter ${
            selectedArea === null ? 'bg-white text-black' : 'bg-white/10'
          }`}
        >
          All Regions
        </button>
        {areas.map(area => (
          <button
            key={area}
            onClick={() => setSelectedArea(area)}
            className={`px-2 py-1 rounded text-sm family-filter ${
              selectedArea === area ? 'bg-white text-black' : 'bg-white/10'
            }`}
          >
            {area}
          </button>
        ))}
      </div>
    </div>
  );
};
