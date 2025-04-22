import { useState, useEffect } from "react";
import { fetchWalsLanguages, Language } from "@/lib/walsData";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Grid2x2 } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import ExpandableLanguageList from "./ExpandableLanguageList";
import FeatureValueChart from "./FeatureValueChart";
import FamilyBarChart from "./FamilyBarChart";

const MAJOR_CATEGORIES = [
  "Phonology",
  "Word Order",
  "Morphology",
  "Verbal Categories",
  "Simple Clauses",
  "Nominal Categories",
];

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

const TreeDiagram = ({ tree }: TreeDiagramProps) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [activeGraph, setActiveGraph] = useState<{
    category: string;
    feature: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    setActiveGraph(null);
  }, [openCategory]);

  return (
    <div className="flex flex-row gap-4 w-full max-h-[70vh]">
      <div className="flex-1 min-w-0 overflow-y-auto pr-4">
        <Accordion
          type="single"
          collapsible
          value={openCategory ?? undefined}
          onValueChange={setOpenCategory}
        >
          {Object.entries(tree).map(([category, features]) => (
            <AccordionItem
              key={category}
              value={category}
              className={cn(
                "bg-white/90 rounded-xl shadow-sm border border-slate-200 mb-3"
              )}
            >
              <AccordionTrigger className="text-lg font-bold text-blue-900 px-3 py-2">
                {category}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1">
                  {Object.entries(features).map(([featureName, values]) => (
                    <div key={featureName} className="mb-2">
                      <div className="font-semibold text-blue-700 bg-slate-100 rounded px-2 py-1 mb-2">
                        {featureName}
                      </div>
                      <ul className="ml-2 border-l-2 border-dashed border-blue-200 pl-4 space-y-2">
                        {Object.entries(values).map(([value, langs]) => (
                          <li key={value} className="flex items-start gap-2">
                            <div
                              className={cn(
                                "flex-1 min-w-0 cursor-pointer rounded hover:bg-blue-50 px-1 py-0.5 transition",
                                activeGraph &&
                                activeGraph.category === category &&
                                activeGraph.feature === featureName &&
                                activeGraph.value === value
                                  ? "bg-blue-100"
                                  : ""
                              )}
                              onClick={() =>
                                setActiveGraph({
                                  category,
                                  feature: featureName,
                                  value,
                                })
                              }
                              title="Click to see top 10 language graph on right"
                            >
                              <div className="flex items-center gap-1">
                                <span className="text-xs bg-blue-50 px-2 py-0.5 rounded whitespace-nowrap">
                                  {value}
                                </span>
                                <span className="ml-1 text-[10px] text-slate-500">
                                  ({langs.length})
                                </span>
                              </div>
                              <ul className="ml-4 space-y-0.5">
                                <ExpandableLanguageList languages={langs} maxVisible={5} />
                              </ul>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="flex-1 min-w-0 flex flex-col bg-white/90 rounded-xl border border-slate-200 shadow-md p-5 h-full justify-center">
        {activeGraph ? (
          (() => {
            const langs =
              tree[activeGraph.category]?.[activeGraph.feature]?.[activeGraph.value] ?? [];
            return (
              <>
                <div className="mb-3 text-sm text-blue-800 font-semibold text-center">
                  <span>
                    {activeGraph.category} &rarr; {activeGraph.feature} &rarr;{" "}
                    <span className="bg-blue-100 px-2 py-0.5 rounded">{activeGraph.value}</span>
                  </span>
                  <br />
                  <span className="text-xs text-slate-500">
                    Top 10 languages (colored) for this attribute value
                  </span>
                </div>
                <FeatureValueChart languages={langs} />

                <div>
                  <div className="mt-7 mb-1 text-[13px] text-blue-800 font-medium text-center">
                    Language family comparison for this value
                  </div>
                  <FamilyBarChart languages={langs} />
                </div>
              </>
            );
          })()
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 opacity-70">
            <span>Select a feature value to see top 10 languages</span>
          </div>
        )}
      </div>
    </div>
  );
};

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
          Collapsible tree view by attribute category &bull; Click feature values for colored language charts
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureTreeAnalysisDialog;
