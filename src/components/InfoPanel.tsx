
import { Language } from '@/lib/walsData';
import { getFamilyColor } from '@/utils/languageColors';
import { X, BookOpen, History } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

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

  // Function to get historical information based on language family
  const getHistoricalInfo = (language: Language) => {
    const familyHistoryMap: Record<string, { period: string, evolution: string, derivedLanguages: string[] }> = {
      'Indo-European': {
        period: 'First attested c. 3500 BCE through Sanskrit, Ancient Greek, and Latin documents',
        evolution: 'Evolved from Proto-Indo-European, with major branches forming around 3000-2000 BCE',
        derivedLanguages: ['Sanskrit → Hindi, Bengali, Marathi', 'Latin → Italian, French, Spanish, Portuguese', 'Proto-Germanic → English, German, Dutch', 'Proto-Slavic → Russian, Polish, Czech']
      },
      'Austronesian': {
        period: 'Archaeological evidence from c. 5000-4000 BCE, written records from 800 CE',
        evolution: 'Spread from Taiwan throughout Southeast Asia and the Pacific islands over millennia',
        derivedLanguages: ['Proto-Malayo-Polynesian → Malay, Indonesian, Tagalog', 'Proto-Oceanic → Hawaiian, Māori, Samoan']
      },
      'Sino-Tibetan': {
        period: 'Oracle bone inscriptions from c. 1250 BCE represent earliest Chinese writing',
        evolution: 'Diverged from common ancestor around 6000-4000 BCE in East Asia',
        derivedLanguages: ['Old Chinese → Middle Chinese → Mandarin, Cantonese, Wu', 'Proto-Tibeto-Burman → Tibetan, Burmese, Karen']
      },
      'Afro-Asiatic': {
        period: 'Egyptian hieroglyphs from c. 3200 BCE and Akkadian cuneiform from c. 2500 BCE',
        evolution: 'Originated in either Northeast Africa or the Near East around 10,000 BCE',
        derivedLanguages: ['Ancient Egyptian → Coptic', 'Proto-Semitic → Arabic, Hebrew, Amharic', 'Proto-Berber → Tamazight, Tuareg']
      },
      'Niger-Congo': {
        period: 'Largely oral traditions until European contact, written records from 16th century CE',
        evolution: 'Diversified beginning around 6000-4000 BCE across sub-Saharan Africa',
        derivedLanguages: ['Proto-Bantu → Swahili, Zulu, Xhosa', 'Proto-Mande → Bambara, Mandinka', 'Proto-Volta-Congo → Yoruba, Igbo']
      },
      'Austroasiatic': {
        period: 'First inscriptions in Old Khmer date to 611 CE',
        evolution: 'Originated in East/Southeast Asia, split from Hmong-Mien around 4000 BCE',
        derivedLanguages: ['Old Mon → Mon', 'Old Khmer → Khmer', 'Proto-Vietic → Vietnamese', 'Proto-Munda → Santali, Mundari']
      },
      'Dravidian': {
        period: 'Tamil Brahmi inscriptions from c. 300 BCE, possible Indus Valley connection',
        evolution: 'Proto-Dravidian estimated to have been spoken around 4500-4000 BCE',
        derivedLanguages: ['Old Tamil → Tamil, Malayalam', 'Proto-South-Central → Telugu, Gondi', 'Proto-Central → Kolami, Naiki']
      }
    };

    // Default historical information for families not in our map
    const defaultHistory = {
      period: 'Historical documentation varies; systematic linguistic study began in the 19th century',
      evolution: 'Part of the approximately 7,000 languages documented in modern linguistics',
      derivedLanguages: ['Various modern dialects and varieties']
    };

    return familyHistoryMap[language.family] || defaultHistory;
  };

  const historicalInfo = getHistoricalInfo(language);
  
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

      {/* Historical Information Section */}
      <div className="mt-4 bg-white/10 rounded p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Historical Information</h3>
          <Popover>
            <PopoverTrigger asChild>
              <div className="hover:bg-white/20 p-1 rounded-full transition-colors cursor-pointer">
                <BookOpen size={16} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-black/90 text-white border-white/20">
              <div className="p-2">
                <h4 className="font-semibold">Language Family History</h4>
                <p className="text-xs opacity-80 mt-1">
                  Data sourced from linguistic historical records maintained by academic institutions including Columbia University and the Max Planck Institute.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Earliest Records:</span>
            <p className="opacity-90">{historicalInfo.period}</p>
          </div>
          <div>
            <span className="font-medium">Historical Evolution:</span>
            <p className="opacity-90">{historicalInfo.evolution}</p>
          </div>
          <div>
            <span className="font-medium">Major Derived Languages:</span>
            <ul className="list-disc pl-4 mt-1 opacity-90">
              {historicalInfo.derivedLanguages.map((derivation, index) => (
                <li key={index}>{derivation}</li>
              ))}
            </ul>
          </div>
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
