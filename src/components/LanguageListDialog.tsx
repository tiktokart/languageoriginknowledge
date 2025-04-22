
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Language {
  id: string;
  name: string;
  family?: string;
}

interface LanguageListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  valueLabel: string;
  languages: Language[];
}

const LanguageListDialog = ({
  open,
  onOpenChange,
  valueLabel,
  languages,
}: LanguageListDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogTitle className="mb-2 text-base">
        Languages with value: <span className="font-semibold">{valueLabel}</span>
      </DialogTitle>
      <ul className="space-y-1 max-h-[350px] overflow-y-auto">
        {languages.map((lang) => (
          <li key={lang.id} className="text-sm flex justify-between">
            <span>{lang.name}</span>
            {lang.family && <span className="text-slate-500 ml-2">{lang.family}</span>}
          </li>
        ))}
      </ul>
    </DialogContent>
  </Dialog>
);

export default LanguageListDialog;
