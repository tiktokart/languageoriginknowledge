
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
  
  const [zoom, setZoom] = useState(1);
  
  // Update dimensions on mount and resize
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

  // Set zoom applied when coordinates are being used
  useEffect(() => {
    if (zoomToCoordinates && !zoomApplied) {
      setZoomApplied(true);
    }
  }, [zoomToCoordinates, zoomApplied]);

  // Auto-rotation effect
  useEffect(() => {
    const animateGlobe = () => {
      if (!isDragging) {
        setRotation(prev => ({
          x: prev.x,
          y: prev.y + 0.1 // Slow rotation around y-axis
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
  }, [isDragging]);

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only set dragging if the target is the container itself, not a language point
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

  // Handle wheel zoom
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

  // Apply zoom when coordinates change
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
    
    // Apply rotation
    let dx = baseX - centerX;
    let dy = baseY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan2(dy, dx);
    angle += (rotation.y * Math.PI) / 180;
    
    // Apply zoom
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
      className="relative map-container w-full h-full overflow-hidden cursor-grab"
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
          className="w-full h-full object-cover opacity-30"
          style={{
            transform: `rotate3d(1, 0, 0, ${rotation.x}deg) rotate3d(0, 1, 0, ${rotation.y}deg)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
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
          />
        ))}
      </div>
    </div>
  );
};
