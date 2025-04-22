
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Language } from "@/lib/walsData";

// --- Simulated Data Generators ---
// In a real app, these would be fetched from APIs.
//
function buildWalsLineage(languages: Language[]) {
  const result: Record<string, Language[]> = {};
  for (const lang of languages) {
    const fam = lang.family ?? "Unknown (WALS)";
    if (!result[fam]) result[fam] = [];
    result[fam].push(lang);
  }
  return result;
}

function buildGlottologLineage(languages: Language[]) {
  // Simulated Glottolog family grouping (placeholder)
  const result: Record<string, Language[]> = {};
  for (const lang of languages) {
    const fam = lang.family
      ? `Glottolog: ${lang.family}`
      : "Glottolog Unknown";
    if (!result[fam]) result[fam] = [];
    result[fam].push(lang);
  }
  return result;
}

function buildGledLineage(languages: Language[]) {
  // Simulated GLED family grouping (placeholder)
  const result: Record<string, Language[]> = {};
  for (const lang of languages) {
    const fam = lang.family
      ? `GLED Cluster: ${lang.family.substring(0,3)}`
      : "GLED Unknown";
    if (!result[fam]) result[fam] = [];
    result[fam].push(lang);
  }
  return result;
}

function buildPhylogeneticLineage(languages: Language[]) {
  // Simulated phylogenetic family clustering (placeholder)
  const clusters = ["Phylo A", "Phylo B", "Phylo C"];
  const result: Record<string, Language[]> = {};
  languages.forEach((lang, idx) => {
    const fam = clusters[idx % clusters.length];
    if (!result[fam]) result[fam] = [];
    result[fam].push(lang);
  });
  return result;
}

// --- Component ---
interface FamilyLineageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  languages: Language[];
}

const SOURCES = [
  { key: "wals", label: "WALS Families" },
  { key: "glottolog", label: "Glottolog" },
  { key: "gled", label: "Global Lexical Database (GLED)" },
  { key: "phylo", label: "Phylogenetic Analysis" },
] as const;

type SourceKey = (typeof SOURCES)[number]["key"];

const getLineageBySource = (languages: Language[], source: SourceKey) => {
  if (source === "wals") return buildWalsLineage(languages);
  if (source === "glottolog") return buildGlottologLineage(languages);
  if (source === "gled") return buildGledLineage(languages);
  if (source === "phylo") return buildPhylogeneticLineage(languages);
  return {};
};

const FamilyLineageDialog = ({
  open,
  onOpenChange,
  languages,
}: FamilyLineageDialogProps) => {
  const [source, setSource] = useState<SourceKey>("wals");
  const families = getLineageBySource(languages, source);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogTitle className="mb-2 text-base flex flex-col items-center">
          <span>Language Family Lineage Overview</span>
          <div className="flex gap-2 mt-2">
            {SOURCES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSource(key)}
                className={`px-2 py-1 rounded border
                  ${source === key ? "bg-blue-700 text-white border-blue-800" : "bg-slate-100 text-blue-800 border-blue-200 hover:bg-blue-200"}
                  text-xs font-medium transition-colors`}
                aria-label={`Show ${label} lineage`}
              >
                {label}
              </button>
            ))}
          </div>
        </DialogTitle>

        <div className="max-h-[400px] overflow-y-auto">
          {Object.entries(families).length === 0 ? (
            <div className="opacity-60 text-center py-12">
              No languages loaded for this tree.
            </div>
          ) : (
            Object.entries(families).map(([family, langs]) => (
              <div key={family} className={`mb-4`}>
                <div className={`font-bold ${getFamilyColorClass(source)}`}>{family}</div>
                <ul className="pl-3 border-l border-blue-200 mt-1 space-y-1">
                  {langs.map((lang) => (
                    <li key={lang.id} className="text-sm">{lang.name}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
        <div className="mt-2 text-xs opacity-60">
          <b>Source:</b> {SOURCES.find(s => s.key === source)?.label}<br/>
          Data simulated for UI purposes. Real Glottolog/GLED/Phylogenetic integration would require external API access.<br/>
          See: <a href="https://glottolog.org/" className="text-blue-700 underline" target="_blank">Glottolog</a>, <a href="https://gled.me/" className="text-blue-700 underline" target="_blank">GLED</a>, <a href="https://en.wikipedia.org/wiki/Phylogenetic_tree" className="text-blue-700 underline" target="_blank">Phylogenetic Analysis</a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Simple coloring to visually hint different sources:
function getFamilyColorClass(source: SourceKey) {
  switch (source) {
    case "glottolog": return "text-green-700";
    case "gled": return "text-purple-700";
    case "phylo": return "text-yellow-700";
    default: return "text-blue-800";
  }
}

export default FamilyLineageDialog;

