
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Language {
  id: string;
  name: string;
  family?: string;
}

interface ExpandableLanguageListProps {
  languages: Language[];
  maxVisible?: number;
}

const ExpandableLanguageList: React.FC<ExpandableLanguageListProps> = ({
  languages,
  maxVisible = 5,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (languages.length <= maxVisible) {
    return (
      <>
        {languages.map((lang) => (
          <li key={lang.id} className="text-xs text-slate-700 truncate">{lang.name}</li>
        ))}
      </>
    );
  }

  return (
    <>
      {languages.slice(0, expanded ? languages.length : maxVisible).map((lang) => (
        <li key={lang.id} className="text-xs text-slate-700 truncate">{lang.name}</li>
      ))}
      <li>
        <button
          className="text-xs italic text-blue-600 flex items-center gap-1 hover:underline"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? (
            <>
              Collapse <ChevronUp size={12} />
            </>
          ) : (
            <>
              +{languages.length - maxVisible} more <ChevronDown size={12} />
            </>
          )}
        </button>
      </li>
    </>
  );
};

export default ExpandableLanguageList;
