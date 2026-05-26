import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePersonalityStat } from '../ComponentShowcase/PersonalityStatContext';

export type SentientSearchBarProps = {
  placeholder?: string;
  onSearch?: (query: string) => void;
  templates?: string[];
};

export const metadata = {
  name: 'Sentient Search Bar',
  description: 'A search input that autocompletes with absurd, self-aware suggestions.',
  category: 'Inputs',
  tags: ['search', 'autocomplete', 'humor', 'personality', 'input'],
};

const DEFAULT_TEMPLATES = [
  '{input} but make it weird',
  '{input} within emotional reach',
  'best {input} for a Tuesday',
  '{input} that won\'t judge me',
  '{input} my therapist warned me about',
  'is {input} just me?',
  '{input} to tell my cat I love them',
  'underrated {input}',
  '{input} but make it 2003',
  'the most chaotic {input}',
  '{input} for people who can\'t even',
  'how to {input} without crying',
  '{input}, anonymously',
  '{input} (be honest)',
  '{input} — but ironically',
  'where to find {input} after hours',
];

const THOUGHTS = [
  "I'm making these up, you know.",
  'Are you sure that\'s what you want?',
  'Bold choice.',
  'Just throwing things at the wall here.',
  'Picked these vibes-first.',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SideEye = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 text-slate-500 dark:text-slate-300">
    <ellipse cx="12" cy="12" rx="10" ry="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="15" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

const SearchIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-slate-400">
    <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

type Suggestion = {
  text: string;
  judgmental: boolean;
};

export default function SentientSearchBar({
  placeholder = 'Search for anything',
  onSearch,
  templates = DEFAULT_TEMPLATES,
}: SentientSearchBarProps) {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [queryCount, setQueryCount] = useState(0);
  const [judgmentCount, setJudgmentCount] = useState(0);
  const [thought, setThought] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();

  usePersonalityStat(`Judgments cast: ${judgmentCount}`);

  // Debounce input → query
  useEffect(() => {
    const t = window.setTimeout(() => setQuery(input.trim()), 200);
    return () => window.clearTimeout(t);
  }, [input]);

  // Generate suggestions whenever the debounced query changes
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setThought(null);
      return;
    }
    const count = Math.min(5, Math.max(4, Math.floor(Math.random() * 2) + 4));
    const picks = shuffle(templates).slice(0, count);
    const nextQueryCount = queryCount + 1;
    const judgmentalIndex = nextQueryCount % 5 === 0 ? 0 : -1;
    const next: Suggestion[] = picks.map((tpl, i) => ({
      text: tpl.replace(/\{input\}/g, query),
      judgmental: i === judgmentalIndex,
    }));
    setSuggestions(next);
    setHighlight(-1);
    setQueryCount(nextQueryCount);
    if (judgmentalIndex !== -1) {
      setJudgmentCount((c) => c + 1);
    }
    setThought(Math.random() < 0.18 ? THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)] : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, templates]);

  const handleSelect = useCallback(
    (s: Suggestion) => {
      setInput(s.text);
      setOpen(false);
      onSearch?.(s.text);
    },
    [onSearch]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Enter' && input.trim()) onSearch?.(input.trim());
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? suggestions.length - 1 : h - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const choice = highlight >= 0 ? suggestions[highlight] : suggestions[0];
      if (choice) handleSelect(choice);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const showDropdown = open && suggestions.length > 0;

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{SearchIcon}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls="sentient-search-listbox"
          aria-activedescendant={highlight >= 0 ? `sentient-opt-${highlight}` : undefined}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <AnimatePresence>
          {showDropdown && (
            <motion.ul
              id="sentient-search-listbox"
              role="listbox"
              initial={reducedMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg"
            >
              {suggestions.map((s, i) => {
                const active = i === highlight;
                return (
                  <li
                    key={`${s.text}-${i}`}
                    id={`sentient-opt-${i}`}
                    role="option"
                    aria-selected={active}
                  >
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(s)}
                      onMouseEnter={() => setHighlight(i)}
                      className={[
                        'w-full text-left text-sm px-3 py-2 flex items-center gap-2',
                        active
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60',
                      ].join(' ')}
                    >
                      <span className="flex-1 truncate">{s.text}</span>
                      {s.judgmental && SideEye}
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-2 min-h-[1.25rem]">
        <AnimatePresence mode="wait">
          {thought && open && (
            <motion.div
              key={thought}
              initial={reducedMotion ? false : { opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-xs italic text-slate-500 dark:text-slate-400"
            >
              💭 {thought}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
