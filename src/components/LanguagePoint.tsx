
import { Language } from '@/lib/walsData';
import { getFamilyColor } from '@/utils/languageColors';

interface LanguagePointProps {
  x: number;
  y: number;
  language: Language;
  isSelected: boolean;
  onClick: () => void;
}

export const LanguagePoint = ({ x, y, language, isSelected, onClick }: LanguagePointProps) => {
  const color = getFamilyColor(language.family);
  
  // Calculate base size based on language frequency
  const getBaseSize = () => {
    // Check if speakers property exists and is a number
    const speakers = typeof language.speakers === 'number' ? language.speakers : 1;
    // Log scale for better visualization
    const baseSize = Math.log10(speakers) * 2;
    return Math.max(3, Math.min(12, baseSize)); // Clamp between 3 and 12 pixels
  };
  
  const baseSize = getBaseSize();
  const size = isSelected ? baseSize * 1.5 : baseSize;
  
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
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 50 : 10,
        pointerEvents: 'auto' // Ensure clicks are captured
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={`${language.name} (${language.family}) - ${typeof language.speakers === 'number' ? language.speakers.toLocaleString() : 'Unknown'} speakers`}
    />
  );
};
