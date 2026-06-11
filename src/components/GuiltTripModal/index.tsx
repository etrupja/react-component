import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePersonalityStat } from '../ComponentShowcase/PersonalityStatContext';

export type GuiltTripModalProps = {
  triggerLabel?: string;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  storageKey?: string;
};

export const metadata = {
  name: 'Guilt-Trip Modal',
  description: 'A confirm dialog whose Cancel button gets sadder every time you hover it.',
  category: 'Overlays',
  tags: ['modal', 'dialog', 'confirm', 'humor', 'personality', 'storage'],
};

// Sadness escalates with every hover over Cancel, capped at heartbroken.
const CANCEL_LABELS = ['Cancel', 'Cancel…?', 'Oh. Okay.', 'fine. cancel.'];

const GUILT_LINES = [
  "It's okay. I didn't want to be confirmed anyway.",
  'You hovered Cancel. I saw that.',
  'My therapist warned me about users like you.',
  'Go ahead. Abandon me. Again.',
];

function loadAbandonCount(storageKey: string): number {
  try {
    const raw = localStorage.getItem(storageKey);
    const n = raw === null ? 0 : parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

function SadFace({ sadness }: { sadness: number }) {
  // Mouth droops and tears well up as sadness (0-3) rises.
  const mouthCurve = 14 + sadness * 1.5;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 text-slate-500 dark:text-slate-300">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <path
        d={`M8 ${mouthCurve + 2}c2-${(mouthCurve - 12) / 1.5} 6-${(mouthCurve - 12) / 1.5} 8 0`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {sadness >= 2 && (
        <motion.path
          d="M9 11.5c0 1.2-1.5 1.8-1.5 3a1.5 1.5 0 0 0 3 0c0-1.2-1.5-1.8-1.5-3z"
          className="text-sky-400"
          fill="currentColor"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: 4 }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      )}
      {sadness >= 3 && (
        <motion.path
          d="M15 11.5c0 1.2-1.5 1.8-1.5 3a1.5 1.5 0 0 0 3 0c0-1.2-1.5-1.8-1.5-3z"
          className="text-sky-400"
          fill="currentColor"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: 4 }}
          transition={{ duration: 1.6, repeat: Infinity, delay: 0.6 }}
        />
      )}
    </svg>
  );
}

export default function GuiltTripModal({
  triggerLabel = 'Delete account',
  title = 'Are you absolutely sure?',
  message = 'This action cannot be undone. Unlike your decision to hover Cancel, which I will also never undo emotionally.',
  onConfirm,
  storageKey = 'guilt-trip-abandons',
}: GuiltTripModalProps) {
  const [open, setOpen] = useState(false);
  const [sadness, setSadness] = useState(0);
  const [abandons, setAbandons] = useState(() => loadAbandonCount(storageKey));
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  usePersonalityStat(
    abandons === 0
      ? 'Abandonments: 0. So far.'
      : `Abandonments: ${abandons} | Current sadness: ${sadness}/3`
  );

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(abandons));
    } catch {}
  }, [abandons, storageKey]);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  function openModal() {
    setSadness(0);
    setOpen(true);
  }

  function handleCancel() {
    setAbandons((n) => n + 1);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleConfirm() {
    setOpen(false);
    triggerRef.current?.focus();
    onConfirm?.();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') handleCancel();
  }

  const guiltLine = GUILT_LINES[Math.min(sadness, GUILT_LINES.length - 1)];

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        ref={triggerRef}
        type="button"
        onClick={openModal}
        className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
      >
        {triggerLabel}
      </button>
      {abandons > 0 && (
        <p className="text-xs italic text-slate-500 dark:text-slate-400">
          You've abandoned this dialog {abandons} time{abandons === 1 ? '' : 's'}.
        </p>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            onClick={handleCancel}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="guilt-trip-title"
              tabIndex={-1}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.95, y: 24, rotate: sadness >= 2 ? -2 : 0 }
              }
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-xl focus:outline-none"
            >
              <div className="flex items-start gap-3">
                <SadFace sadness={sadness} />
                <div className="min-w-0">
                  <h3 id="guilt-trip-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{message}</p>
                </div>
              </div>

              <div className="mt-3 h-5" aria-live="polite">
                <AnimatePresence mode="wait">
                  {sadness > 0 && (
                    <motion.p
                      key={guiltLine}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs italic text-slate-500 dark:text-slate-400"
                    >
                      {guiltLine}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <motion.button
                  type="button"
                  onMouseEnter={() => setSadness((s) => Math.min(s + 1, 3))}
                  onClick={handleCancel}
                  animate={
                    reducedMotion
                      ? undefined
                      : { rotate: sadness * -1.5, y: sadness * 1.5 }
                  }
                  className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {CANCEL_LABELS[Math.min(sadness, CANCEL_LABELS.length - 1)]}
                </motion.button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
