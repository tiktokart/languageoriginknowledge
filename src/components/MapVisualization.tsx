
import { useEffect, useRef, useState } from 'react';
import { Language } from '@/lib/walsData';
import { projectLatLongToXY } from '@/utils/mapProjection';
import { LanguagePoint } from './LanguagePoint';

interface MapVisualizationProps {
  languages: Language[];
  selectedLanguage: Language | null;
  setSelectedLanguage: (language: Language | null) => void;
  zoomToCoordinates: { centerLat: number; centerLong: number; scale: number; } | null;
}

export const MapVisualization = ({
  languages,
  selectedLanguage,
  setSelectedLanguage,
  zoomToCoordinates
}: MapVisualizationProps) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomApplied, setZoomApplied] = useState(false);
  
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

  // Reset zoom applied state when zoom coordinates change
  useEffect(() => {
    if (zoomToCoordinates) {
      setZoomApplied(false);
    }
  }, [zoomToCoordinates]);

  const getTransformedCoordinates = (lat: number, long: number) => {
    if (!zoomToCoordinates) {
      return projectLatLongToXY(lat, long, dimensions.width, dimensions.height);
    }

    // If zoom coordinates are provided, transform the points
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
    
    setZoomApplied(true);
    
    return [
      centerX + dx * scale,
      centerY + dy * scale
    ];
  };
  
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
