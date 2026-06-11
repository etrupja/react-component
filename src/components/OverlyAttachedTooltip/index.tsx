import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePersonalityStat } from '../ComponentShowcase/PersonalityStatContext';

export type OverlyAttachedTooltipProps = {
  content?: string;
  clinginess?: number;
  children?: ReactNode;
};

export const metadata = {
  name: 'Overly Attached Tooltip',
  description: 'A tooltip that chases your cursor when you try to leave it.',
  category: 'Overlays',
  tags: ['tooltip', 'hover', 'humor', 'personality', 'animation'],
};

type Phase = 'hidden' | 'attached' | 'clinging' | 'giving-up';

// Pleading escalates with how far the cursor has run from the anchor.
function pleaFor(distance: number, clinginess: number): string {
  const f = distance / clinginess;
  if (f < 0.35) return 'wait—';
  if (f < 0.7) return 'I had more to say!';
  return 'please. PLEASE.';
}

export default function OverlyAttachedTooltip({
  content = 'This button does something. Anyway, how are you? Really?',
  clinginess = 180,
  children,
}: OverlyAttachedTooltipProps) {
  const [phase, setPhase] = useState<Phase>('hidden');
  const [chase, setChase] = useState({ x: 0, y: 0, distance: 0 });
  const [goodbyes, setGoodbyes] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const giveUpTimerRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  usePersonalityStat(
    goodbyes === 0
      ? 'Goodbyes endured: 0. The honeymoon phase.'
      : `Goodbyes endured: ${goodbyes} | Attachment style: anxious`
  );

  // While clinging, the tooltip tracks the cursor until it has run
  // `clinginess` px from the anchor — then it finally lets go.
  useEffect(() => {
    if (phase !== 'clinging') return;
    function handleMove(e: MouseEvent) {
      const container = containerRef.current;
      const anchor = anchorRef.current;
      if (!container || !anchor) return;
      const cRect = container.getBoundingClientRect();
      const aRect = anchor.getBoundingClientRect();
      const ax = aRect.left + aRect.width / 2;
      const ay = aRect.top;
      const distance = Math.hypot(e.clientX - ax, e.clientY - ay);
      setChase({
        x: e.clientX - cRect.left,
        y: e.clientY - cRect.top - 28,
        distance,
      });
      if (distance >= clinginess) setPhase('giving-up');
    }
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [phase, clinginess]);

  // Once it gives up, it sulks for a moment, then hides.
  useEffect(() => {
    if (phase !== 'giving-up') return;
    giveUpTimerRef.current = window.setTimeout(() => {
      setPhase('hidden');
      setGoodbyes((n) => n + 1);
    }, 1000);
    return () => {
      if (giveUpTimerRef.current !== null) window.clearTimeout(giveUpTimerRef.current);
    };
  }, [phase]);

  function handleEnter() {
    setPhase('attached');
  }

  function handleLeave() {
    if (phase !== 'attached') return;
    if (reducedMotion) {
      // No chase scene — just one quiet goodbye.
      setPhase('giving-up');
    } else {
      setPhase('clinging');
    }
  }

  const visible = phase !== 'hidden';
  const clinging = phase === 'clinging';
  const givingUp = phase === 'giving-up';

  const text = givingUp
    ? 'fine. go.'
    : clinging
      ? pleaFor(chase.distance, clinginess)
      : content;

  return (
    <div ref={containerRef} className="relative flex flex-col items-center gap-3 pt-16 pb-8">
      <span
        ref={anchorRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        className="inline-block"
        aria-describedby={visible ? 'overly-attached-tooltip' : undefined}
      >
        {children ?? (
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Hover me
          </button>
        )}
      </span>

      <AnimatePresence>
        {visible && (
          <motion.div
            key="tooltip"
            id="overly-attached-tooltip"
            role="tooltip"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.9 }}
            animate={
              clinging
                ? {
                    opacity: 1,
                    scale: 1,
                    left: chase.x,
                    top: chase.y,
                    x: '-50%',
                    y: '-100%',
                    rotate: [-3, 3, -3],
                  }
                : { opacity: givingUp ? 0.8 : 1, y: 0, scale: 1, x: '-50%' }
            }
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 10, scale: 0.7, transition: { duration: 0.45 } }
            }
            transition={
              clinging
                ? {
                    left: { type: 'spring', stiffness: 120, damping: 16 },
                    top: { type: 'spring', stiffness: 120, damping: 16 },
                    rotate: { duration: 0.5, repeat: Infinity },
                  }
                : { duration: 0.18 }
            }
            className={`absolute z-10 max-w-[14rem] rounded-md px-2.5 py-1.5 text-xs font-medium text-white shadow-md pointer-events-none ${
              givingUp ? 'bg-slate-500 dark:bg-slate-600' : 'bg-slate-800 dark:bg-slate-700'
            }`}
            style={clinging ? undefined : { left: '50%', top: '0.5rem' }}
          >
            {text}
            {!clinging && !givingUp && (
              <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 h-2 w-2 rotate-45 bg-slate-800 dark:bg-slate-700" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {clinging
          ? 'It is following you.'
          : givingUp
            ? 'It is processing the breakup.'
            : 'Hover, then try to leave.'}
      </p>
    </div>
  );
}
