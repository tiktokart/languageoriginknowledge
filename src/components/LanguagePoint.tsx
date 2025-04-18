
import { Language } from '@/lib/walsData';
import { getFamilyColor } from '@/utils/languageColors';

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
    return Math.max(3, Math.min(12, baseSize)); // Clamp between 3 and 12 pixels
  };
  
  const baseSize = getBaseSize();
  const size = isSelected ? baseSize * 1.5 : baseSize;
  
  return (
    <div 
      className={`absolute rounded-full cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-150 language-point ${isSelected ? 'selected z-50' : ''} ${className}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderWidth: '1px',
        borderColor: 'rgba(255,255,255,0.5)', // Subtle white border
        boxShadow: isSelected 
          ? `0 0 15px 3px ${color}, 0 0 10px 2px rgba(255,255,255,0.3)` 
          : '0 0 5px 1px rgba(255,255,255,0.2)',
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 50 : 10,
        pointerEvents: 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={`${language.name} (${language.family}) - ${language.speakers?.toLocaleString() || 'Unknown'} speakers`}
    />
  );
};
