
import { Language } from '@/lib/walsData';
import { getFamilyColor } from '@/utils/languageColors';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface LanguagePointProps {
  x: number;
  y: number;
  language: Language;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export const LanguagePoint = ({ 
  x, y, language, isSelected, onClick, className = '' 
}: LanguagePointProps) => {
  const color = getFamilyColor(language.family);
  
  const getBaseSize = () => {
    const speakers = language.speakers || 100000;
    const baseSize = Math.log10(speakers) * 2;
    return Math.max(4, Math.min(14, baseSize)); // Slightly larger points
  };
  
  const baseSize = getBaseSize();
  const size = isSelected ? baseSize * 1.8 : baseSize;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`absolute rounded-full cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-150 language-point ${isSelected ? 'selected z-50' : ''} ${className}`}
          style={{
            left: `${x}px`,
            top: `${y}px`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderWidth: '1.5px',
            borderColor: 'rgba(255,255,255,0.7)', // More visible white border
            boxShadow: isSelected 
              ? `0 0 20px 5px ${color}, 0 0 10px 2px rgba(255,255,255,0.5)` 
              : '0 0 8px 2px rgba(255,255,255,0.3)',
            transform: 'translate(-50%, -50%)',
            zIndex: isSelected ? 50 : language.speakers && language.speakers > 10000000 ? 30 : 10,
            pointerEvents: 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-black/80 text-white border-white/20 backdrop-blur-md">
        <div className="text-xs">
          <div className="font-bold">{language.name}</div>
          <div>{language.family}</div>
          <div>{language.speakers?.toLocaleString() || 'Unknown'} speakers</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
