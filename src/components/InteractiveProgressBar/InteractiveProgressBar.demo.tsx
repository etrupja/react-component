import React, { useState } from 'react';
import { InteractiveProgressBar, Theme } from './InteractiveProgressBar';

const THEMES: { id: Theme; label: string }[] = [
  { id: 'space', label: 'Space 🚀' },
  { id: 'nature', label: 'Nature 🌱' },
  { id: 'minimal', label: 'Minimal ⚡' },
];

export default function InteractiveProgressBarDemo() {
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<Theme>('space');
  const [showConfetti, setShowConfetti] = useState(true);

  function selectTheme(t: Theme) {
    setTheme(t);
    setProgress(0);
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {THEMES.map((t) => {
          const active = t.id === theme;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTheme(t.id)}
              className={[
                'rounded-md px-3 py-1.5 text-sm font-medium border transition-colors',
                active
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700',
              ].join(' ')}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <label className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <input
          type="checkbox"
          checked={showConfetti}
          onChange={(e) => setShowConfetti(e.target.checked)}
          className="h-4 w-4"
        />
        Show confetti on completion
      </label>

      <InteractiveProgressBar
        progress={progress}
        theme={theme}
        showConfetti={showConfetti}
        onComplete={() => console.log('Progress complete!')}
        width="100%"
        height="30px"
      />

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setProgress(0)}
          disabled={progress === 0}
          className="rounded-md px-3 py-1.5 text-sm font-semibold bg-blue-600 text-white disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setProgress((p) => Math.min(p + 10, 100))}
          disabled={progress === 100}
          className="rounded-md px-3 py-1.5 text-sm font-semibold bg-blue-600 text-white disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Increase +10%
        </button>
        <button
          type="button"
          onClick={() => setProgress(100)}
          disabled={progress === 100}
          className="rounded-md px-3 py-1.5 text-sm font-semibold bg-blue-600 text-white disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Complete
        </button>
      </div>
    </div>
  );
}
