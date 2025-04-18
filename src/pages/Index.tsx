import { useState, useEffect, useRef } from 'react';
import { fetchWalsLanguages, Language } from '@/lib/walsData';

// Color mapping for language families
const getFamilyColor = (family: string): string => {
  const colorMap: Record<string, string> = {
    'Indo-European': '#FF5733',
    'Sino-Tibetan': '#33FF57',
    'Niger-Congo': '#3357FF',
    'Austronesian': '#FF33A8',
    'Afro-Asiatic': '#33FFF5',
    'Dravidian': '#FFD700',
    'Turkic': '#9932CC',
    'Uralic': '#FF4500',
    'Japonic': '#00FF00',
    'Koreanic': '#FF00FF',
    'Tai-Kadai': '#1E90FF',
    'Mongolic': '#FF8C00',
    'Hmong-Mien': '#FF1493',
    'Austroasiatic': '#00BFFF',
  };

  return colorMap[family] || '#FFFFFF';
};

// Helper function to project latitude and longitude to x,y coordinates
const projectLatLongToXY = (latitude: number, longitude: number, width: number, height: number): [number, number] => {
  // Simple equirectangular projection
  const x = (longitude + 180) * (width / 360);
  const y = (90 - latitude) * (height / 180);
  return [x, y];
};

// Language point component with enhanced click interaction
const LanguagePoint = ({ 
  x, 
  y, 
  language, 
  isSelected, 
  onClick 
}: { 
  x: number; 
  y: number; 
  language: Language; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const color = getFamilyColor(language.family);
  const size = isSelected ? 8 : 4;
  
  return (
    <div 
      className={`absolute rounded-full cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-150 language-point ${isSelected ? 'selected z-50' : ''}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        boxShadow: isSelected ? `0 0 10px 2px ${color}` : 'none',
        transform: 'translate(-50%, -50%)'
      }}
      onClick={onClick}
      title={`${language.name} (${language.family})`}
    />
  );
};

// Filter controls component with zoom functionality
const FilterControls = ({ 
  families, 
  selectedFamily, 
  onSelectFamily,
  onZoomToFamily 
}: { 
  families: string[]; 
  selectedFamily: string | null; 
  onSelectFamily: (family: string | null) => void;
  onZoomToFamily: (family: string) => void;
}) => {
  return (
    <div className="fixed left-0 top-0 p-4 bg-black/70 backdrop-blur-md rounded-br-lg text-white">
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
            style={{ borderColor: getFamilyColor(family) }}
          >
            {family}
          </button>
        ))}
      </div>
    </div>
  );
};

// Map visualization with zooming capabilities
const MapVisualization = ({
  languages,
  selectedLanguage,
  setSelectedLanguage,
  zoomToCoordinates
}: {
  languages: Language[];
  selectedLanguage: Language | null;
  setSelectedLanguage: (language: Language | null) => void;
  zoomToCoordinates: { centerLat: number; centerLong: number; scale: number } | null;
}) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Apply zoom transform to points
  const getTransformedCoordinates = (lat: number, long: number) => {
    if (!zoomToCoordinates) {
      return projectLatLongToXY(lat, long, dimensions.width, dimensions.height);
    }

    const scale = zoomToCoordinates.scale;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    const [baseX, baseY] = projectLatLongToXY(lat, long, dimensions.width, dimensions.height);
    const [zoomCenterX, zoomCenterY] = projectLatLongToXY(
      zoomToCoordinates.centerLat,
      zoomToCoordinates.centerLong,
      dimensions.width,
      dimensions.height
    );
    
    const dx = baseX - zoomCenterX;
    const dy = baseY - zoomCenterY;
    
    return [
      centerX + dx * scale,
      centerY + dy * scale
    ];
  };
  
  // Project all languages to x,y coordinates with zoom
  const points = languages.map(language => {
    const [x, y] = getTransformedCoordinates(language.latitude, language.longitude);
    return { x, y, language };
  });
  
  return (
    <div ref={containerRef} className="relative map-container w-full h-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0">
        <img 
          src="/world-map.svg" 
          alt="World Map" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      {points.map(({ x, y, language }) => (
        <LanguagePoint 
          key={language.id}
          x={x}
          y={y}
          language={language}
          isSelected={selectedLanguage?.id === language.id}
          onClick={() => setSelectedLanguage(language)}
        />
      ))}
    </div>
  );
};

// Macroarea filter component
const MacroareaFilter = ({
  selectedArea,
  setSelectedArea
}: {
  selectedArea: string | null;
  setSelectedArea: (area: string | null) => void;
}) => {
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

// Info panel component
const InfoPanel = ({ language }: { language: Language | null }) => {
  if (!language) return null;
  
  // Group features by category for better organization
  const groupedFeatures: Record<string, Record<string, any>> = {};
  
  if (language.features) {
    Object.entries(language.features).forEach(([key, value]) => {
      const [category, featureName] = key.split(': ');
      if (!groupedFeatures[category]) {
        groupedFeatures[category] = {};
      }
      groupedFeatures[category][featureName || key] = value;
    });
  }
  
  return (
    <div className="fixed right-0 top-0 h-full w-1/4 bg-black/70 text-white p-4 info-panel overflow-y-auto">
      <h2 className="text-2xl font-bold mb-2">{language.name}</h2>
      <div className="flex items-center gap-2 mb-4">
        <div 
          className="w-4 h-4 rounded-full" 
          style={{ backgroundColor: getFamilyColor(language.family) }}
        />
        <span className="font-medium">{language.family}</span>
      </div>
      
      <div className="bg-white/10 rounded p-3 mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium">Latitude:</div>
          <div>{language.latitude.toFixed(2)}</div>
          <div className="font-medium">Longitude:</div>
          <div>{language.longitude.toFixed(2)}</div>
        </div>
      </div>
      
      {Object.keys(groupedFeatures).length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3">Language Features</h3>
          
          {Object.entries(groupedFeatures).map(([category, features]) => (
            <div key={category} className="mb-4">
              <h4 className="font-medium text-sm bg-white/20 px-2 py-1 rounded">{category}</h4>
              <div className="feature-category" style={{ borderColor: getFamilyColor(language.family) }}>
                {Object.entries(features).map(([featureName, value]) => (
                  <div key={featureName} className="border-b border-white/10 py-2">
                    <div className="font-medium text-sm">{featureName}</div>
                    <div className="text-sm opacity-80">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        className="absolute top-2 right-2 hover:bg-white/20 p-1 rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

// Stats display component
const StatsDisplay = ({ languages }: { languages: Language[] }) => {
  // Count languages by family
  const familyCounts: Record<string, number> = {};
  languages.forEach(lang => {
    if (!familyCounts[lang.family]) {
      familyCounts[lang.family] = 0;
    }
    familyCounts[lang.family]++;
  });
  
  // Get top 5 families
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

// Main Index component with zoom state
const Index = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [filteredLanguages, setFilteredLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [zoomToCoordinates, setZoomToCoordinates] = useState<{
    centerLat: number;
    centerLong: number;
    scale: number;
  } | null>(null);
  
  // Get unique language families
  const families = [...new Set(languages.map(lang => lang.family))];
  
  // Fetch WALS language data
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWalsLanguages();
        setLanguages(data);
        setFilteredLanguages(data);
      } catch (error) {
        console.error("Failed to load languages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLanguages();
  }, []);
  
  // Calculate center coordinates for a language family
  const handleZoomToFamily = (family: string) => {
    const familyLanguages = languages.filter(lang => lang.family === family);
    if (familyLanguages.length === 0) return;
    
    const avgLat = familyLanguages.reduce((sum, lang) => sum + lang.latitude, 0) / familyLanguages.length;
    const avgLong = familyLanguages.reduce((sum, lang) => sum + lang.longitude, 0) / familyLanguages.length;
    
    setZoomToCoordinates({
      centerLat: avgLat,
      centerLong: avgLong,
      scale: 2.5 // Adjust this value to control zoom level
    });
  };
  
  // Reset zoom when "All" is selected
  useEffect(() => {
    if (!selectedFamily) {
      setZoomToCoordinates(null);
    }
  }, [selectedFamily]);

  // Filter languages by family and region
  useEffect(() => {
    let filtered = languages;
    
    // Apply family filter if selected
    if (selectedFamily) {
      filtered = filtered.filter(lang => lang.family === selectedFamily);
    }
    
    // Apply region filter if selected
    if (selectedArea) {
      filtered = filtered.filter(lang => {
        // For generated languages with explicit macroarea
        if (lang.macroarea) {
          return lang.macroarea === selectedArea;
        }
        
        // For languages without explicit macroarea, use geographical heuristics
        const { latitude, longitude } = lang;
        
        switch (selectedArea) {
          case 'Africa':
            return latitude > -35 && latitude < 37 && longitude > -20 && longitude < 55;
          case 'Europe':
            return latitude > 36 && latitude < 72 && longitude > -25 && longitude < 40;
          case 'Asia':
            return (latitude > 0 && latitude < 82 && longitude > 40 && longitude < 180) ||
                   (latitude > 0 && latitude < 40 && longitude > 30 && longitude < 40);
          case 'North America':
            return latitude > 15 && latitude < 90 && longitude > -170 && longitude < -30;
          case 'South America':
            return latitude > -60 && latitude < 15 && longitude > -90 && longitude < -30;
          case 'Oceania':
            return (latitude > -50 && latitude < 0 && longitude > 110 && longitude < 180) ||
                   (latitude > -50 && latitude < 30 && longitude > 130 && longitude < 180) ||
                   (latitude > -50 && latitude < 30 && longitude < -130 && longitude > -180);
          default:
            return true;
        }
      });
    }
    
    setFilteredLanguages(filtered);
  }, [selectedFamily, selectedArea, languages]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-200">
            World Atlas of Language Structures
          </h2>
          <p className="text-lg mb-4">Loading language data...</p>
          <p className="text-sm opacity-70 max-w-md mx-auto">
            Preparing visualization of 300+ languages across major language families worldwide
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen overflow-hidden relative">
      <MapVisualization 
        languages={filteredLanguages} 
        selectedLanguage={selectedLanguage} 
        setSelectedLanguage={setSelectedLanguage}
        zoomToCoordinates={zoomToCoordinates}
      />
      
      <FilterControls 
        families={families}
        selectedFamily={selectedFamily}
        onSelectFamily={setSelectedFamily}
        onZoomToFamily={handleZoomToFamily}
      />
      
      <MacroareaFilter
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
      />
      
      <InfoPanel language={selectedLanguage} />
      
      <StatsDisplay languages={filteredLanguages} />
      
      <div className="absolute bottom-4 left-4 text-white bg-black/60 p-3 rounded backdrop-blur-md border border-white/10 shadow-xl z-10">
        <h1 className="text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-200">
          World Atlas of Language Structures
        </h1>
        <p className="opacity-90">Interactive visualization of global language distribution</p>
        <p className="opacity-70 text-xs mt-2">Based on WALS database | Click on points to see language details</p>
        <div className="flex gap-3 mt-3">
          <a href="https://wals.info/" target="_blank" rel="noopener noreferrer" className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-all">
            WALS Database
          </a>
          <a href="https://lkozma.net/blog/languages-visualization.html" target="_blank" rel="noopener noreferrer" className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-all">
            About This Visualization
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
