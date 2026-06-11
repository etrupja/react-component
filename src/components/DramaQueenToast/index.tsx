import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePersonalityStat } from '../ComponentShowcase/PersonalityStatContext';

export type DramaQueenToastProps = {
  duration?: number;
  sulkDuration?: number;
};

export const metadata = {
  name: 'Drama Queen Toast',
  description: 'A toast system where the drama is inversely proportional to the severity.',
  category: 'Feedback',
  tags: ['toast', 'notification', 'humor', 'personality', 'feedback'],
};

type Severity = 'info' | 'success' | 'warning' | 'error';

type Toast = {
  id: number;
  severity: Severity;
  state: 'active' | 'sulking';
};

const SirenIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-rose-600 dark:text-rose-400">
    <path
      fill="currentColor"
      d="M7 18v-5a5 5 0 0 1 10 0v5h1a1 1 0 1 1 0 2H6a1 1 0 1 1 0-2h1zm5-16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zM4.2 4.2a1 1 0 0 1 1.4 0L7 5.6A1 1 0 0 1 5.6 7L4.2 5.6a1 1 0 0 1 0-1.4zm15.6 0a1 1 0 0 1 0 1.4L18.4 7A1 1 0 0 1 17 5.6l1.4-1.4a1 1 0 0 1 1.4 0z"
    />
  </svg>
);

const SparkleIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-amber-500">
    <path
      fill="currentColor"
      d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2zm7 12l.9 3.1L23 18l-3.1.9L19 22l-.9-3.1L15 18l3.1-.9L19 14z"
    />
  </svg>
);

const MehIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-slate-400">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="9" cy="10" r="1" fill="currentColor" />
    <circle cx="15" cy="10" r="1" fill="currentColor" />
    <path d="M8 15h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// The inversion table: the more trivial the event, the bigger the production.
const DRAMA: Record<
  Severity,
  {
    buttonLabel: string;
    headline: string;
    subtext: string | null;
    container: string;
    shake: boolean;
    icon: React.ReactNode | null;
  }
> = {
  info: {
    buttonLabel: 'Info',
    headline: 'SOMEONE LIKED YOUR COMMENT!!!',
    subtext: 'THIS CANNOT WAIT. DROP EVERYTHING.',
    container:
      'border-2 border-rose-500 bg-rose-50 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 px-4 py-3 shadow-lg',
    shake: true,
    icon: SirenIcon,
  },
  success: {
    buttonLabel: 'Success',
    headline: 'SETTINGS SAVED. FLAWLESSLY.',
    subtext: 'History will remember this moment.',
    container:
      'border-2 border-amber-400 bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 px-4 py-3 shadow-md',
    shake: false,
    icon: SparkleIcon,
  },
  warning: {
    buttonLabel: 'Warning',
    headline: 'Storage is 80% full.',
    subtext: 'Mildly concerning, I suppose.',
    container:
      'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 shadow-sm',
    shake: false,
    icon: null,
  },
  error: {
    buttonLabel: 'Error',
    headline: 'database is gone, whatever.',
    subtext: null,
    container:
      'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 px-2.5 py-1.5 text-[11px]',
    shake: false,
    icon: MehIcon,
  },
};

const SEVERITIES: Severity[] = ['info', 'success', 'warning', 'error'];

export default function DramaQueenToast({
  duration = 5_000,
  sulkDuration = 2_500,
}: DramaQueenToastProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ignored, setIgnored] = useState(0);
  const idRef = useRef(0);
  const timersRef = useRef<Set<number>>(new Set());
  const reducedMotion = useReducedMotion();

  usePersonalityStat(
    ignored === 0
      ? 'Toasts ignored: 0. It is watching, though.'
      : `Toasts ignored: ${ignored} | Drama supply: unlimited`
  );

  useEffect(
    () => () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
    },
    []
  );

  function schedule(fn: () => void, ms: number) {
    const t = window.setTimeout(() => {
      timersRef.current.delete(t);
      fn();
    }, ms);
    timersRef.current.add(t);
  }

  function fire(severity: Severity) {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, severity, state: 'active' }]);
    schedule(() => {
      // Unclicked toasts don't just expire — they sulk first.
      setToasts((prev) =>
        prev.map((t) => (t.id === id && t.state === 'active' ? { ...t, state: 'sulking' } : t))
      );
      schedule(() => {
        setToasts((prev) => {
          if (!prev.some((t) => t.id === id)) return prev;
          setIgnored((n) => n + 1);
          return prev.filter((t) => t.id !== id);
        });
      }, sulkDuration);
    }, duration);
  }

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-wrap justify-center gap-2">
        {SEVERITIES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => fire(s)}
            className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {DRAMA[s].buttonLabel}
          </button>
        ))}
      </div>

      <div
        className="relative mt-4 h-56 overflow-hidden rounded-lg border border-dashed border-slate-200 dark:border-slate-700"
        aria-live="polite"
      >
        {toasts.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-xs italic text-slate-400 dark:text-slate-500">
            Fire a notification. Brace yourself.
          </p>
        )}

        <div className="absolute bottom-2 right-2 flex w-[calc(100%-1rem)] flex-col items-end gap-2">
          <AnimatePresence>
            {toasts.map((toast) => {
              const d = DRAMA[toast.severity];
              const sulking = toast.state === 'sulking';
              return (
                <motion.button
                  key={toast.id}
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  layout={!reducedMotion}
                  initial={
                    reducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: 80, scale: d.shake ? 1.15 : 1 }
                  }
                  animate={
                    sulking
                      ? { opacity: 0.55, x: 24, scale: 0.85 }
                      : { opacity: 1, x: 0, scale: 1 }
                  }
                  exit={{ opacity: 0, x: 60, transition: { duration: 0.3 } }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className={`max-w-full rounded-lg text-left text-xs font-medium cursor-pointer ${d.container}`}
                >
                  {/* Shake lives on an inner span so it doesn't fight framer-motion's transform. */}
                  <span
                    className={`flex items-center gap-2 ${
                      d.shake && !sulking && !reducedMotion ? 'drama-queen-shake' : ''
                    }`}
                  >
                    {!sulking && d.icon}
                    <span className="min-w-0">
                      {sulking ? (
                        <span className="italic font-normal">
                          fine. it probably wasn't important anyway.
                        </span>
                      ) : (
                        <>
                          {d.headline}
                          {d.subtext && (
                            <span className="block text-[10px] font-normal opacity-80">
                              {d.subtext}
                            </span>
                          )}
                        </>
                      )}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        Click a toast to acknowledge it. Ignore it and it will sulk.
      </p>
    </div>
  );
}
