
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
  const size = isSelected ? 10 : 4;
  
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
        zIndex: isSelected ? 50 : 10
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={`${language.name} (${language.family})`}
    />
  );
};
