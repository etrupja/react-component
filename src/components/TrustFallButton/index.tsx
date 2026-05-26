import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { usePersonalityStat } from '../ComponentShowcase/PersonalityStatContext';

export type TrustFallButtonProps = {
  label?: string;
  holdDuration?: number;
  onConfirm: () => void;
  variant?: 'danger' | 'warning';
};

export const metadata = {
  name: 'Trust Fall Button',
  description: 'A destructive action button that visibly panics while you hold it down.',
  category: 'Buttons',
  tags: ['button', 'confirm', 'destructive', 'humor', 'personality'],
};

type Phase = 'idle' | 'holding' | 'released-early' | 'confirmed';

const SWEAT_THRESHOLDS = [30, 60, 90] as const;

const VARIANTS = {
  danger: {
    bg: 'bg-rose-600',
    bgHover: 'hover:bg-rose-700',
    ring: 'stroke-rose-400',
    flash: 'bg-rose-500',
  },
  warning: {
    bg: 'bg-amber-500',
    bgHover: 'hover:bg-amber-600',
    ring: 'stroke-amber-300',
    flash: 'bg-amber-400',
  },
} as const;

function speechFor(phase: Phase, progress: number): string | null {
  if (phase === 'released-early') return 'Phew.';
  if (phase === 'confirmed') return 'It is done.';
  if (phase !== 'holding') return null;
  if (progress >= 100) return 'AAAAAAA';
  if (progress >= 75) return 'OK OK OK!!';
  if (progress >= 50) return 'Last chance!';
  if (progress >= 25) return 'Wait, really?';
  return null;
}

const SweatDrop = (
  <svg viewBox="0 0 12 16" aria-hidden="true" className="h-3.5 w-3.5 text-sky-400">
    <path
      fill="currentColor"
      d="M6 0c0 4-5 6-5 10a5 5 0 0 0 10 0c0-4-5-6-5-10z"
    />
  </svg>
);

const PuffIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-slate-400">
    <circle cx="6" cy="14" r="3" fill="currentColor" opacity="0.6" />
    <circle cx="12" cy="11" r="4" fill="currentColor" opacity="0.7" />
    <circle cx="18" cy="14" r="3" fill="currentColor" opacity="0.6" />
  </svg>
);

export default function TrustFallButton({
  label = 'Delete everything',
  holdDuration = 2500,
  onConfirm,
  variant = 'danger',
}: TrustFallButtonProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [furthestHold, setFurthestHold] = useState(0);
  const [drops, setDrops] = useState<{ id: number; x: number }[]>([]);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const emittedRef = useRef<Set<number>>(new Set());
  const dropIdRef = useRef(0);
  const onConfirmRef = useRef(onConfirm);
  const phaseRef = useRef<Phase>('idle');
  const resetTimerRef = useRef<number | null>(null);

  const reducedMotion = useReducedMotion();
  const shakeX = useMotionValue(0);
  const shakeY = useMotionValue(0);

  useEffect(() => {
    onConfirmRef.current = onConfirm;
  }, [onConfirm]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  usePersonalityStat(`Bravery: ${furthestHold}%`);

  const clearRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  const fullReset = useCallback(() => {
    setPhase('idle');
    setProgress(0);
    setDrops([]);
    emittedRef.current.clear();
    shakeX.set(0);
    shakeY.set(0);
  }, [shakeX, shakeY]);

  const emitDrop = useCallback(() => {
    const id = ++dropIdRef.current;
    const x = (Math.random() - 0.5) * 30;
    setDrops((d) => [...d, { id, x }]);
    window.setTimeout(() => {
      setDrops((d) => d.filter((drop) => drop.id !== id));
    }, 900);
  }, []);

  const tick = useCallback(
    (now: number) => {
      if (phaseRef.current !== 'holding') return;
      const elapsed = now - startRef.current;
      const next = Math.min((elapsed / holdDuration) * 100, 100);
      setProgress(next);
      setFurthestHold((prev) => (next > prev ? Math.round(next) : prev));

      SWEAT_THRESHOLDS.forEach((t) => {
        if (next >= t && !emittedRef.current.has(t)) {
          emittedRef.current.add(t);
          emitDrop();
        }
      });

      if (!reducedMotion) {
        const amp = Math.pow(next / 100, 1.4) * 6;
        shakeX.set((Math.random() - 0.5) * amp * 2);
        shakeY.set((Math.random() - 0.5) * amp * 2);
      }

      if (next >= 100) {
        clearRaf();
        shakeX.set(0);
        shakeY.set(0);
        setPhase('confirmed');
        try {
          onConfirmRef.current?.();
        } catch (err) {
          console.error('TrustFallButton onConfirm threw', err);
        }
        clearResetTimer();
        resetTimerRef.current = window.setTimeout(fullReset, 2000);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [holdDuration, reducedMotion, shakeX, shakeY, emitDrop, clearRaf, clearResetTimer, fullReset]
  );

  const startHold = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (phaseRef.current !== 'idle') return;
      e.currentTarget.setPointerCapture(e.pointerId);
      clearResetTimer();
      emittedRef.current.clear();
      setDrops([]);
      setProgress(0);
      setPhase('holding');
      startRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    },
    [tick, clearResetTimer]
  );

  const endHold = useCallback(() => {
    if (phaseRef.current !== 'holding') return;
    clearRaf();
    shakeX.set(0);
    shakeY.set(0);
    setPhase('released-early');
    clearResetTimer();
    resetTimerRef.current = window.setTimeout(fullReset, 1200);
  }, [clearRaf, shakeX, shakeY, fullReset, clearResetTimer]);

  useEffect(
    () => () => {
      clearRaf();
      clearResetTimer();
    },
    [clearRaf, clearResetTimer]
  );

  const v = VARIANTS[variant];
  const speech = speechFor(phase, progress);
  const showFlash = phase === 'confirmed';

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="relative h-7 w-full flex items-end justify-center">
        <AnimatePresence mode="wait">
          {speech && (
            <motion.div
              key={speech}
              initial={reducedMotion ? false : { y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { y: -4, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="rounded-md bg-slate-800 dark:bg-slate-700 px-2.5 py-1 text-xs font-medium text-white shadow-md relative"
            >
              {speech}
              <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 h-2 w-2 rotate-45 bg-slate-800 dark:bg-slate-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div style={{ x: shakeX, y: shakeY }} className="relative">
        <button
          type="button"
          onPointerDown={startHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          onPointerCancel={endHold}
          disabled={phase === 'confirmed'}
          aria-label={`${label} — hold to confirm`}
          className={[
            'relative inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
            'transition-colors touch-none',
            v.bg,
            v.bgHover,
            phase === 'confirmed' ? 'cursor-default' : 'cursor-pointer',
          ].join(' ')}
        >
          <svg
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
            aria-hidden="true"
          >
            <rect
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              rx="8"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="2"
            />
            <rect
              x="1"
              y="1"
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              rx="8"
              fill="none"
              className={v.ring}
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={100}
              strokeDashoffset={100 - progress}
              style={{ transition: 'stroke-dashoffset 80ms linear' }}
            />
          </svg>
          <span className="relative z-10">{label}</span>
          {showFlash && (
            <motion.span
              className={`absolute inset-0 rounded-lg ${v.flash}`}
              initial={{ opacity: 0.85 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              aria-hidden="true"
            />
          )}
        </button>

        <div className="absolute top-full left-0 right-0 h-8 pointer-events-none overflow-visible">
          <AnimatePresence>
            {drops.map((d) => (
              <motion.span
                key={d.id}
                className="absolute left-1/2"
                style={{ x: d.x }}
                initial={{ y: -2, opacity: 0, scale: 0.6 }}
                animate={{ y: 22, opacity: [0, 1, 1, 0], scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeIn' }}
              >
                {SweatDrop}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {phase === 'released-early' && (
          <motion.span
            className="absolute -top-1 left-1/2 -translate-x-1/2 pointer-events-none"
            initial={{ opacity: 0, scale: 0.6, y: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 1.3], y: -10 }}
            transition={{ duration: 1 }}
          >
            {PuffIcon}
          </motion.span>
        )}
      </motion.div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {phase === 'holding'
          ? 'Keep holding…'
          : phase === 'confirmed'
            ? 'Confirmed.'
            : 'Press and hold to confirm.'}
      </p>
    </div>
  );
}
