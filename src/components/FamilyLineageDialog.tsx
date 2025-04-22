
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Language {
  id: string;
  name: string;
  family?: string;
}

interface FamilyLineageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  languages: Language[];
}

// Builds a lineage tree: { family: [languages] }
function buildLineage(languages: Language[]) {
  const result: Record<string, Language[]> = {};
  for (const lang of languages) {
    const fam = lang.family ?? "Unknown";
    if (!result[fam]) result[fam] = [];
    result[fam].push(lang);
  }
  return result;
}

const FamilyLineageDialog = ({
  open,
  onOpenChange,
  languages,
}: FamilyLineageDialogProps) => {
  const families = buildLineage(languages);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogTitle className="mb-2 text-base">Language Family Lineage Overview</DialogTitle>
        <div className="max-h-[400px] overflow-y-auto">
          {Object.entries(families).map(([family, langs]) => (
            <div key={family} className="mb-4">
              <div className="font-bold text-blue-800">{family}</div>
              <ul className="pl-3 border-l border-blue-200 mt-1 space-y-1">
                {langs.map((lang) => (
                  <li key={lang.id} className="text-sm">{lang.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FamilyLineageDialog;
