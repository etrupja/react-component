import React, { useState, ComponentType } from 'react';

type Props = {
  component: ComponentType<any>;
  componentProps?: Record<string, unknown>;
};

const RefreshIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5"
    />
  </svg>
);

export default function PreviewTab({ component: Component, componentProps }: Props) {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setResetKey((k) => k + 1)}
        className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors"
        title="Reset"
      >
        {RefreshIcon}
        Reset
      </button>
      <div className="flex items-center justify-center p-6 min-h-[320px] bg-slate-50 dark:bg-slate-900">
        <Component key={resetKey} {...(componentProps || {})} />
      </div>
    </div>
  );
}
