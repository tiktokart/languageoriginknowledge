
import { Language } from "@/lib/walsData";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tree } from "lucide-react";
import { cn } from "@/lib/utils";

// Color palette for categories for pedagogy style
const categoryColors: Record<string, string> = {
  "Phonology": "#D3E4FD",
  "Morphology": "#E5DEFF",
  "Nominal Categories": "#FEC6A1",
  "Nominal Syntax": "#FEF7CD",
  "Verbal Categories": "#F2FCE2",
  "Word Order": "#FFD6E2",
  "Simple Clauses": "#FDE1D3",
  "Complex Sentences": "#F1F0FB",
  "Lexicon": "#FFDEE2",
  "Other": "#F6F6F7",
};

function groupFeaturesByCategory(features: Record<string, any>) {
  const grouped: Record<string, Array<{ name: string; value: string }>> = {};
  Object.entries(features || {}).forEach(([key, value]) => {
    const [category, featureName] = key.split(": ");
    const actualCategory = category || "Other";
    if (!grouped[actualCategory]) grouped[actualCategory] = [];
    grouped[actualCategory].push({
      name: featureName || key,
      value: value as string,
    });
  });
  return grouped;
}

interface AttributeTreeDialogProps {
  language: Language;
}

const AttributeTreeDialog = ({ language }: AttributeTreeDialogProps) => {
  const grouped = groupFeaturesByCategory(language.features || {});

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 text-sm bg-white/10 rounded-full px-3 py-1.5 hover:bg-white/20 transition-colors">
          <Tree size={14} />
          <span>Attribute Family Tree</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-white/90 text-black shadow-2xl border-2 border-[#e5e7eb]">
        <div className="py-3 px-1">
          <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-500">
            {language.name}: Attribute Family Tree
          </DialogTitle>
          <div className="mt-2 text-center text-sm opacity-60">
            A pedagogically organized tree of all structural language attributes.
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-8">
            {Object.entries(grouped).map(([category, features]) => (
              <div
                key={category}
                className={cn(
                  "min-w-[210px] max-w-xs rounded-xl shadow border px-4 py-3 flex flex-col items-center",
                  "bg-white",
                  "transition",
                )}
                style={{
                  borderColor: categoryColors[category] || "#e5e7eb",
                  background: `${categoryColors[category] || "#fafbff"}50`,
                }}
              >
                <div
                  className="font-semibold rounded-full px-2 py-1 text-base"
                  style={{
                    background: categoryColors[category] || "#f4f4f6",
                    color: "#23326b",
                  }}
                >
                  {category}
                </div>
                <div className="mt-4 w-full flex flex-col gap-2">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "pl-2 border-l-2 rounded border-dashed",
                        "bg-white/80 py-1",
                      )}
                      style={{
                        borderColor: categoryColors[category] || "#cedaf6",
                      }}
                    >
                      <div className="font-medium text-sm text-blue-900 mb-0.5">{feature.name}</div>
                      <div className="text-xs opacity-80 text-slate-700">{feature.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-xs opacity-40">
            Pedagogical style visualization &bull; All features shown
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttributeTreeDialog;
