import { useState, useEffect } from 'react';
import { fetchWalsLanguages, Language } from '@/lib/walsData';
import { FilterControls } from '@/components/FilterControls';
import { MapVisualization } from '@/components/MapVisualization';
import { MacroareaFilter } from '@/components/MacroareaFilter';
import { InfoPanel } from '@/components/InfoPanel';
import { StatsDisplay } from '@/components/StatsDisplay';
import { SearchBar } from '@/components/SearchBar';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Index = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [filteredLanguages, setFilteredLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(true);
  
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
    
    const lats = familyLanguages.map(lang => lang.latitude);
    const longs = familyLanguages.map(lang => lang.longitude);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLong = Math.min(...longs);
    const maxLong = Math.max(...longs);
    
    const avgLat = (minLat + maxLat) / 2;
    const avgLong = (minLong + maxLong) / 2;
    
    const latSpread = maxLat - minLat;
    const longSpread = maxLong - minLong;
    const maxSpread = Math.max(latSpread, longSpread);
    
    const scale = Math.max(0.8, Math.min(2.5, 5 / maxSpread));
    
    setZoomToCoordinates({
      centerLat: avgLat,
      centerLong: avgLong,
      scale: scale
    });
  };

  useEffect(() => {
    if (selectedArea && !zoomToCoordinates) {
      const regionCoordinates: Record<string, { lat: number; long: number; scale: number }> = {
        'Africa': { lat: 5, long: 20, scale: 2 },
        'Europe': { lat: 50, long: 10, scale: 2.5 },
        'Asia': { lat: 35, long: 90, scale: 1.8 },
        'North America': { lat: 40, long: -100, scale: 2 },
        'South America': { lat: -20, long: -60, scale: 2 },
        'Oceania': { lat: -25, long: 135, scale: 2 }
      };
      
      const region = regionCoordinates[selectedArea];
      if (region) {
        setZoomToCoordinates({
          centerLat: region.lat,
          centerLong: region.long,
          scale: region.scale
        });
      }
    }
  }, [selectedArea]);
  
  useEffect(() => {
    if (!selectedFamily && !selectedArea) {
      setZoomToCoordinates(null);
    }
  }, [selectedFamily, selectedArea]);

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
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
        <SearchBar 
          languages={languages}
          onSelectLanguage={setSelectedLanguage}
        />
      </div>
      
      <div className="absolute top-20 right-4 z-10">
        <FilterControls 
          families={families}
          selectedFamily={selectedFamily}
          onSelectFamily={setSelectedFamily}
          onZoomToFamily={handleZoomToFamily}
        />
      </div>
      
      {/* Bottom bar with fixed width containers and proper spacing */}
      <div className="fixed left-0 right-0 bottom-4 z-10 flex justify-between items-end px-4">
        <div className="pointer-events-auto">
          <MacroareaFilter
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
          />
        </div>
        
        <div className="pointer-events-auto">
          <StatsDisplay languages={filteredLanguages} />
        </div>
        
        <div className="pointer-events-auto">
          <Collapsible 
            open={isAboutOpen} 
            onOpenChange={setIsAboutOpen} 
            className="w-full"
          >
            <div className="bg-black/70 rounded-lg backdrop-blur-md border border-white/10 shadow-xl w-64">
              <div className="p-3 flex items-center justify-between">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-200">
                  World Atlas of Language Structures
                </h1>
                <CollapsibleTrigger className="rounded-full hover:bg-white/10 p-1 transition-colors">
                  {isAboutOpen ? (
                    <MinusCircle className="h-5 w-5 text-white/80" />
                  ) : (
                    <PlusCircle className="h-5 w-5 text-white/80" />
                  )}
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <div className="px-3 pb-3">
                  <p className="text-white opacity-90">Interactive visualization of global language distribution</p>
                  <p className="text-white opacity-70 text-xs mt-2">Based on WALS database | Click on points to see language details</p>
                  <div className="flex gap-3 mt-3">
                    <a href="https://wals.info/" target="_blank" rel="noopener noreferrer" className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-all text-white">
                      WALS Database
                    </a>
                    <a href="https://lkozma.net/blog/languages-visualization.html" target="_blank" rel="noopener noreferrer" className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-all text-white">
                      About This Visualization
                    </a>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </div>
      
      <InfoPanel 
        language={selectedLanguage} 
        onClose={() => setSelectedLanguage(null)} 
      />
    </div>
  );
};

export default Index;
