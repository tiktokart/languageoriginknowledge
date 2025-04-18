
import { useState, useEffect } from 'react';
import { fetchWalsLanguages, Language } from '@/lib/walsData';
import { FilterControls } from '@/components/FilterControls';
import { MapVisualization } from '@/components/MapVisualization';
import { MacroareaFilter } from '@/components/MacroareaFilter';
import { InfoPanel } from '@/components/InfoPanel';
import { StatsDisplay } from '@/components/StatsDisplay';

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
  
  const families = [...new Set(languages.map(lang => lang.family))];
  
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
  
  const handleZoomToFamily = (family: string) => {
    console.log("Zooming to family:", family);
    const familyLanguages = languages.filter(lang => lang.family === family);
    if (familyLanguages.length === 0) return;
    
    // Calculate the average coordinates for the language family
    const avgLat = familyLanguages.reduce((sum, lang) => sum + lang.latitude, 0) / familyLanguages.length;
    const avgLong = familyLanguages.reduce((sum, lang) => sum + lang.longitude, 0) / familyLanguages.length;
    
    // Set zoom coordinates with a higher scale for better visibility
    setZoomToCoordinates({
      centerLat: avgLat,
      centerLong: avgLong,
      scale: 2.5
    });
  };
  
  // Reset zoom when family is cleared
  useEffect(() => {
    if (!selectedFamily) {
      setZoomToCoordinates(null);
    }
  }, [selectedFamily]);

  // Filter languages based on selected family and area
  useEffect(() => {
    let filtered = languages;
    
    if (selectedFamily) {
      filtered = filtered.filter(lang => lang.family === selectedFamily);
    }
    
    if (selectedArea) {
      filtered = filtered.filter(lang => {
        if (lang.macroarea) {
          return lang.macroarea === selectedArea;
        }
        
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
  
  // Loading screen
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
