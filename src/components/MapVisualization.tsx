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
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  
  const [zoom, setZoom] = useState(1.3);
  
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

  useEffect(() => {
    if (zoomToCoordinates) {
      setZoomApplied(false);
    }
  }, [zoomToCoordinates]);

  useEffect(() => {
    if (zoomToCoordinates && !zoomApplied) {
      setZoomApplied(true);
      setZoom(zoomToCoordinates.scale);
      
      // Calculate rotation based on longitude to center the view
      const targetLongitude = zoomToCoordinates.centerLong;
      setRotation(prev => ({
        x: prev.x,
        y: -targetLongitude
      }));
    }
  }, [zoomToCoordinates, zoomApplied]);

  useEffect(() => {
    const animateGlobe = () => {
      if (!isDragging && !zoomToCoordinates) {
        setRotation(prev => ({
          x: prev.x,
          y: prev.y + 0.1
        }));
      }
      animationRef.current = requestAnimationFrame(animateGlobe);
    };
    
    animationRef.current = requestAnimationFrame(animateGlobe);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, zoomToCoordinates]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('map-container')) {
      setIsDragging(true);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMousePosition.x;
      const deltaY = e.clientY - lastMousePosition.y;
      
      setRotation(prev => ({
        x: prev.x + deltaY * 0.5,
        y: prev.y + deltaX * 0.5
      }));
      
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      setZoom(prevZoom => Math.min(Math.max(0.5, prevZoom + delta), 4));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, []);

  useEffect(() => {
    if (zoomToCoordinates) {
      setZoom(zoomToCoordinates.scale);
    }
  }, [zoomToCoordinates]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const getTransformedCoordinates = (lat: number, long: number) => {
    const [baseX, baseY] = projectLatLongToXY(lat, long, dimensions.width, dimensions.height);
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    let dx = baseX - centerX;
    let dy = baseY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan2(dy, dx);
    angle += (rotation.y * Math.PI) / 180;
    
    const zoomedDistance = distance * zoom;
    const rotatedX = centerX + zoomedDistance * Math.cos(angle);
    const rotatedY = centerY + zoomedDistance * Math.sin(angle);
    
    return [rotatedX, rotatedY];
  };
  
  const points = languages.map(language => {
    const [x, y] = getTransformedCoordinates(language.latitude, language.longitude);
    return { x, y, language };
  });
  
  return (
    <div 
      ref={containerRef} 
      className="relative map-container w-full h-full overflow-hidden cursor-grab bg-[#0F1319]" // Darker background
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0">
        <img 
          src="/world-map.svg" 
          alt="World Map" 
          className="w-full h-full object-cover opacity-15" // Less opacity for better contrast
          style={{
            transform: `rotate3d(1, 0, 0, ${rotation.x}deg) rotate3d(0, 1, 0, ${rotation.y}deg)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            filter: 'brightness(0.6) contrast(1.4) saturate(0.8)' // Adjusted for better point visibility
          }}
        />
      </div>
      <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
        {points.map(({ x, y, language }) => (
          <LanguagePoint 
            key={language.id}
            x={x}
            y={y}
            language={language}
            isSelected={selectedLanguage?.id === language.id}
            onClick={() => setSelectedLanguage(language)}
            className="shadow-[0_0_15px_4px_rgba(255,255,255,0.25)]"
          />
        ))}
      </div>
      
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col bg-black/50 backdrop-blur-md rounded overflow-hidden">
        <button 
          className="p-2 text-white hover:bg-white/20"
          onClick={() => setZoom(prev => Math.min(prev + 0.5, 4))}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button 
          className="p-2 text-white hover:bg-white/20 border-t border-white/20"
          onClick={() => setZoom(prev => Math.max(prev - 0.5, 0.5))}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};
