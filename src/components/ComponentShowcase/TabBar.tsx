import React, { useRef } from 'react';

export type TabId = 'preview' | 'code' | 'usage';

type TabDef = {
  id: TabId;
  label: string;
  icon: React.ReactNode;
};

const EyeIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
    />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const CodeIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 6 2 12l6 6M16 6l6 6-6 6M14 4l-4 16"
    />
  </svg>
);

const BookIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4h10a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4zM4 16a4 4 0 0 1 4-4h10"
    />
  </svg>
);

const TABS: TabDef[] = [
  { id: 'preview', label: 'Preview', icon: EyeIcon },
  { id: 'code', label: 'Code', icon: CodeIcon },
  { id: 'usage', label: 'Usage', icon: BookIcon },
];

type Props = {
  tab: TabId;
  onChange: (tab: TabId) => void;
};

export default function TabBar({ tab, onChange }: Props) {
  const refs = useRef<Record<TabId, HTMLButtonElement | null>>({
    preview: null,
    code: null,
    usage: null,
  });

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') {
      return;
    }
    e.preventDefault();
    const idx = TABS.findIndex((t) => t.id === tab);
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % TABS.length;
    if (e.key === 'ArrowLeft') next = (idx - 1 + TABS.length) % TABS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = TABS.length - 1;
    const nextId = TABS[next].id;
    onChange(nextId);
    refs.current[nextId]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Component view"
      className="flex gap-1 border-b border-slate-200 dark:border-slate-800 px-4 bg-white dark:bg-slate-950"
      onKeyDown={handleKeyDown}
    >
      {TABS.map((t) => {
        const active = t.id === tab;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el;
            }}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active}
            aria-controls={`panel-${t.id}`}
            tabIndex={active ? 0 : -1}
            type="button"
            onClick={() => onChange(t.id)}
            className={[
              'inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium -mb-px transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-t',
              active
                ? 'border-b-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
                : 'border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200',
            ].join(' ')}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
