import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useInterval } from '../../hooks/useInterval';
import { usePersonalityStat } from '../ComponentShowcase/PersonalityStatContext';

export type PassiveAggressiveSpinnerProps = {
  stages?: { at: number; text: string }[];
  mutterings?: string[];
  size?: number;
};

export const metadata = {
  name: 'Passive-Aggressive Loading Spinner',
  description: 'A spinner whose status text gets saltier the longer it spins.',
  category: 'Feedback',
  tags: ['spinner', 'loading', 'humor', 'personality', 'feedback'],
};

const DEFAULT_STAGES = [
  { at: 0, text: 'Loading…' },
  { at: 8_000, text: 'Still loading. No rush.' },
  { at: 18_000, text: 'Taking its sweet time, apparently.' },
  { at: 30_000, text: 'I mean, YOU try fetching this data.' },
];

const DEFAULT_MUTTERINGS = [
  'Any minute now. Probably.',
  "It's not me, it's the network.",
  'The server says hi, by the way.',
  'Have you considered lowering your expectations?',
];

// Visual mood per escalation stage: color shifts warmer, rotation gets lazier.
const STAGE_LOOKS = [
  { stroke: 'stroke-blue-500', text: 'text-slate-500 dark:text-slate-400', spin: 0.9 },
  { stroke: 'stroke-amber-500', text: 'text-amber-600 dark:text-amber-400', spin: 1.6 },
  { stroke: 'stroke-orange-500', text: 'text-orange-600 dark:text-orange-400', spin: 2.6 },
  { stroke: 'stroke-rose-500', text: 'text-rose-600 dark:text-rose-400', spin: 4 },
];

function retryLabel(retries: number): string {
  if (retries === 0) return 'Retry';
  if (retries === 1) return 'Retry again';
  return `Sure, retry #${retries + 1}`;
}

export default function PassiveAggressiveSpinner({
  stages = DEFAULT_STAGES,
  mutterings = DEFAULT_MUTTERINGS,
  size = 48,
}: PassiveAggressiveSpinnerProps) {
  const [elapsed, setElapsed] = useState(0);
  const [retries, setRetries] = useState(0);
  const startRef = useRef(Date.now());
  const reducedMotion = useReducedMotion();

  // Re-render every 500ms to advance the salt level.
  useInterval(() => setElapsed(Date.now() - startRef.current), 500);

  const sorted = useMemo(() => [...stages].sort((a, b) => a.at - b.at), [stages]);

  const stageIdx = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < sorted.length; i++) {
      if (elapsed >= sorted[i].at) idx = i;
    }
    return idx;
  }, [sorted, elapsed]);

  const lastStage = sorted[sorted.length - 1];
  // Past the final stage (+ a grace period), rotate through mutterings.
  const muttering = elapsed >= lastStage.at + 10_000;
  const message = muttering
    ? mutterings[Math.floor((elapsed - lastStage.at) / 4_000) % mutterings.length]
    : sorted[stageIdx].text;

  const look = STAGE_LOOKS[Math.min(stageIdx, STAGE_LOOKS.length - 1)];

  usePersonalityStat(
    `Patience tested: ${Math.floor(elapsed / 1000)}s | Retries that won't help: ${retries}`
  );

  function handleRetry() {
    startRef.current = Date.now();
    setElapsed(0);
    setRetries((r) => r + 1);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.span
        className="inline-block"
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={
          reducedMotion
            ? undefined
            : { repeat: Infinity, ease: 'linear', duration: look.spin }
        }
        style={{ width: size, height: size }}
        role="status"
        aria-label={`Loading. ${message}`}
      >
        <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            strokeWidth="5"
            className="stroke-slate-200 dark:stroke-slate-700"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="28 72"
            className={`${look.stroke} transition-colors duration-700`}
          />
        </svg>
      </motion.span>

      <div className="h-6 flex items-center" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={reducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`text-sm italic ${look.text} transition-colors duration-700`}
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={handleRetry}
        className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        {retryLabel(retries)}
      </button>
    </div>
  );
}
