
import { useState } from 'react';
import { Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Language } from '@/lib/walsData';
import { getFamilyColor } from '@/utils/languageColors';

interface SearchBarProps {
  languages: Language[];
  onSelectLanguage: (language: Language) => void;
}

export const SearchBar = ({ languages, onSelectLanguage }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setOpen(true);
    }
  };

  return (
    <div className={`search-bar-container fixed left-4 top-4 transition-all duration-300 z-50 ${isExpanded ? 'expanded' : 'minimized'}`}>
      {!isExpanded ? (
        <button 
          onClick={toggleExpand}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Search className="w-5 h-5 text-gray-600" />
        </button>
      ) : (
        <Command className="rounded-lg border shadow-md bg-white text-gray-800">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Search languages..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              onClick={toggleExpand}
              className="ml-2 p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <CommandList>
            <CommandEmpty>No languages found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.id}
                  onSelect={() => {
                    onSelectLanguage(language);
                    setIsExpanded(false);
                  }}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: getFamilyColor(language.family) }}
                    />
                    <span>{language.name}</span>
                    <span className="text-xs opacity-50">({language.family})</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}
    </div>
  );
};
