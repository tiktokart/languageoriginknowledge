import { useState, useEffect } from "react";
import { fetchWalsLanguages, Language } from "@/lib/walsData";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Grid2x2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ExpandableLanguageList from "./ExpandableLanguageList";
import FeatureValueChart from "./FeatureValueChart";

// Define the feature categories to group by
const MAJOR_CATEGORIES = [
  "Phonology",
  "Word Order",
  "Morphology",
  "Verbal Categories",
  "Simple Clauses",
  "Nominal Categories",
];

// Returns a nested structure featureTree[category][featureName][featureValue] = [array of languages]
function buildFeatureTree(languages: Language[]) {
  const tree: Record<
    string,
    Record<string, Record<string, Language[]>>
  > = {};

  for (const lang of languages) {
    if (!lang.features) continue;
    Object.entries(lang.features).forEach(([key, value]) => {
      const [category, featureName] = key.split(": ");
      if (!MAJOR_CATEGORIES.includes(category)) return;
      if (!tree[category]) tree[category] = {};
      if (!tree[category][featureName]) tree[category][featureName] = {};
      if (!tree[category][featureName][value])
        tree[category][featureName][value] = [];
      tree[category][featureName][value].push(lang);
    });
  }

  return tree;
}

interface TreeDiagramProps {
  tree: ReturnType<typeof buildFeatureTree>;
}

const TreeDiagram = ({ tree }: TreeDiagramProps) => (
  <div className="flex flex-col gap-8">
    {Object.entries(tree).map(([category, features]) => (
      <div key={category} className="bg-white/90 rounded-xl shadow-md border border-slate-200 p-4">
        <h2 className="text-lg font-bold mb-2 text-blue-900">{category}</h2>
        <div className="flex flex-wrap gap-6">
          {Object.entries(features).map(([featureName, values]) => (
            <div key={featureName} className="min-w-[260px] max-w-full">
              <div className="font-semibold text-blue-700 bg-slate-100 rounded px-2 py-1 mb-3">{featureName}</div>
              <ul className="ml-2 border-l-2 border-dashed border-blue-300 pl-4 space-y-3">
                {Object.entries(values).map(([value, langs]) => (
                  <li key={value} className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-blue-50 px-2 py-0.5 rounded whitespace-nowrap">{value}</span>
                        <span className="ml-1 text-[10px] text-slate-500">({langs.length})</span>
                      </div>
                      <ul className="ml-4 space-y-0.5">
                        <ExpandableLanguageList languages={langs} maxVisible={5} />
                      </ul>
                    </div>
                    <div className="pt-2">
                      <FeatureValueChart languages={langs} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const FeatureTreeAnalysisDialog = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetchWalsLanguages().then(setLanguages);
  }, [open]);

  const tree = buildFeatureTree(languages);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-1 text-sm bg-white/10 rounded-full px-3 py-1.5 hover:bg-white/20 transition-colors"
          aria-label="Attribute Family Tree Analysis"
          title="Show 2D family tree analysis by all attributes"
        >
          <Grid2x2 size={16} />
          <span>Feature Family Tree Analysis</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl bg-white/90 text-black px-4 py-6 overflow-y-auto max-h-[90vh]">
        <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-500 mb-2">
          All Languages: Feature Family Tree Analysis
        </DialogTitle>
        <p className="text-center text-xs opacity-60 mb-5">
          2D tree diagram visualization: languages grouped by major structural attributes.
        </p>
        {Object.keys(tree).length === 0 ? (
          <div className="mt-10 text-center text-slate-500 text-sm">Loading analysis...</div>
        ) : (
          <TreeDiagram tree={tree} />
        )}
        <div className="mt-8 text-center text-xs opacity-40">
          Pedagogical tree view by attribute category &bull; Shows up to 5 sample languages per feature
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureTreeAnalysisDialog;
