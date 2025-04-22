
import { Language } from '@/lib/walsData';
import { getFamilyColor } from '@/utils/languageColors';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChevronRight, BookOpen, Lightbulb } from 'lucide-react';

interface LanguageAnalysisDialogProps {
  language: Language;
}

export const LanguageAnalysisDialog = ({ language }: LanguageAnalysisDialogProps) => {
  // Get primary features to display in the analysis
  const getMainFeatures = () => {
    if (!language.features) return [];
    
    const importantCategories = [
      'Phonology',
      'Morphology',
      'Nominal Categories',
      'Nominal Syntax',
      'Word Order',
      'Simple Clauses',
      'Complex Sentences',
      'Lexicon'
    ];
    
    // Get one feature from each important category if available
    const mainFeatures: { category: string; name: string; value: string }[] = [];
    
    Object.entries(language.features).forEach(([key, value]) => {
      const [category, featureName] = key.split(': ');
      if (importantCategories.includes(category) && 
          !mainFeatures.some(f => f.category === category)) {
        mainFeatures.push({
          category,
          name: featureName || key,
          value: value as string
        });
      }
    });
    
    return mainFeatures;
  };

  // Generate insights based on language features
  const generateInsights = () => {
    const insights = [];
    
    // Family-based insight
    insights.push(`${language.name} belongs to the ${language.family} language family.`);
    
    // Word order insight if available
    const wordOrderFeature = language.features && 
      Object.entries(language.features).find(([key]) => 
        key.includes('Word Order') && key.includes('Order of Subject'));
        
    if (wordOrderFeature) {
      const [_, wordOrder] = wordOrderFeature;
      insights.push(`This language uses ${wordOrder} word order.`);
    }
    
    // Geographic insight
    insights.push(`Primarily spoken in ${language.macroarea || 'its geographic region'}.`);
    
    return insights;
  };

  const mainFeatures = getMainFeatures();
  const insights = generateInsights();
  const familyColor = getFamilyColor(language.family);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 text-sm bg-white/10 rounded-full px-3 py-1.5 hover:bg-white/20 transition-colors">
          <BookOpen size={14} />
          <span>Language Analysis</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-black/80 backdrop-blur-md text-white border-white/20">
        <div className="pt-6">
          <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            {language.name} Language Analysis
          </DialogTitle>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Family Tree Visualization */}
            <div className="border border-white/10 rounded-lg p-4 bg-black/40">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: familyColor }}></span>
                Language Family Tree
              </h3>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <div className="w-24 text-sm opacity-70">Family</div>
                  <div className="flex-1 font-medium">{language.family}</div>
                </div>
                
                <div className="ml-4 mt-2 border-l-2 pl-4" style={{ borderColor: familyColor }}>
                  <div className="flex items-center">
                    <div className="w-24 text-sm opacity-70">Branch</div>
                    <div className="flex-1 font-medium">{language.name}</div>
                  </div>
                  
                  <div className="ml-4 mt-2 border-l-2 pl-4 border-dashed" style={{ borderColor: familyColor }}>
                    <div className="text-sm opacity-80">
                      <div className="mb-1">Latitude: {language.latitude.toFixed(2)}</div>
                      <div>Longitude: {language.longitude.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature Analysis */}
            <div className="border border-white/10 rounded-lg p-4 bg-black/40">
              <h3 className="text-lg font-semibold mb-3">Key Linguistic Features</h3>
              
              <div className="space-y-3">
                {mainFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <ChevronRight size={18} className="text-blue-300 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">{feature.category}</div>
                      <div className="text-xs opacity-70">{feature.name}: {feature.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Insights Section */}
          <div className="mt-6 border border-white/10 rounded-lg p-4 bg-black/40">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lightbulb size={18} className="text-yellow-300" />
              Linguistic Insights
            </h3>
            
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full mt-2" style={{ backgroundColor: familyColor }}></div>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 text-center text-xs opacity-50">
            Analysis based on World Atlas of Language Structures data
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageAnalysisDialog;
