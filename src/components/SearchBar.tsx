
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Language } from '@/lib/walsData';
import { getFamilyColor } from '@/utils/languageColors';

interface SearchBarProps {
  languages: Language[];
  onSelectLanguage: (language: Language) => void;
}

export const SearchBar = ({ languages, onSelectLanguage }: SearchBarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed left-1/2 top-4 -translate-x-1/2 w-80 z-50">
      <Command className="rounded-lg border shadow-md bg-black/70 text-white backdrop-blur-sm">
        <div className="flex items-center border-b border-white/20 px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput 
            placeholder="Search languages..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-white/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <CommandList>
          <CommandEmpty>No languages found.</CommandEmpty>
          <CommandGroup>
            {languages.map((language) => (
              <CommandItem
                key={language.id}
                onSelect={() => {
                  onSelectLanguage(language);
                }}
                className="cursor-pointer hover:bg-white/10"
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
    </div>
  );
};
