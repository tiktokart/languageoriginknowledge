
import { Language } from '@/lib/walsData';
import { getFamilyColor } from '@/utils/languageColors';
import { X } from 'lucide-react';

interface InfoPanelProps {
  language: Language | null;
  onClose: () => void;
}

export const InfoPanel = ({ language, onClose }: InfoPanelProps) => {
  if (!language) return null;
  
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
    <div className="fixed right-0 top-0 h-full w-1/4 bg-black/70 text-white p-4 info-panel overflow-y-auto backdrop-blur-sm z-40">
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
              <div className="feature-category mt-2" style={{ borderColor: getFamilyColor(language.family) }}>
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
        className="absolute top-2 right-2 hover:bg-white/20 p-1 rounded-full transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
      >
        <X size={20} />
      </button>
    </div>
  );
};
