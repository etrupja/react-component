import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useInterval } from '../../hooks/useInterval';
import { usePersonalityStat } from '../ComponentShowcase/PersonalityStatContext';

export type NosyStepperProps = {
  steps?: { title: string; content: string }[];
  pacing?: { rushed: number; lingering: number };
  onComplete?: () => void;
};

export const metadata = {
  name: 'Nosy Stepper',
  description: 'A multi-step wizard that judges your pace and gasps when you go back.',
  category: 'Navigation',
  tags: ['stepper', 'wizard', 'navigation', 'humor', 'personality'],
};

const DEFAULT_STEPS = [
  { title: 'Name', content: 'What should we call you?' },
  { title: 'Preferences', content: 'Pick some preferences. They all get ignored anyway.' },
  { title: 'Review', content: "Double-check everything. Or blast through — I'm just a stepper." },
  { title: 'Confirm', content: 'Last step. You made it. Statistically improbable.' },
];

const DEFAULT_PACING = { rushed: 2_000, lingering: 20_000 };

const RUSHED_LINES = [
  'Whoa. Did you even read that?',
  'Speed-running a form. Bold.',
  "That step had WORDS in it, you know.",
];

const LINGER_LINES = [
  "It's just a form field. Take your time, I guess.",
  'Should I… come back later?',
  'Still there? Blink twice if you need help.',
];

const GASP_LINES = [
  '*gasp* Second thoughts?',
  'Going BACK? We were doing so well.',
  'Fine. Re-read it. I can wait.',
];

export default function NosyStepper({
  steps = DEFAULT_STEPS,
  pacing = DEFAULT_PACING,
  onComplete,
}: NosyStepperProps) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const [comment, setComment] = useState<{ id: number; text: string } | null>(null);
  const [rushed, setRushed] = useState(0);
  const [gasps, setGasps] = useState(0);

  const enteredAtRef = useRef(Date.now());
  const lingerNaggedRef = useRef<Set<number>>(new Set());
  const commentIdRef = useRef(0);
  const commentTimerRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  usePersonalityStat(
    done
      ? `Final score — rushed: ${rushed}, gasps caused: ${gasps}`
      : `Steps rushed: ${rushed} | Gasps caused: ${gasps}`
  );

  function say(text: string) {
    const id = ++commentIdRef.current;
    setComment({ id, text });
    if (commentTimerRef.current !== null) window.clearTimeout(commentTimerRef.current);
    commentTimerRef.current = window.setTimeout(() => {
      setComment((c) => (c?.id === id ? null : c));
    }, 3_500);
  }

  // Check once a second whether the user has been parked on a step too long.
  useInterval(
    () => {
      const elapsed = Date.now() - enteredAtRef.current;
      if (elapsed >= pacing.lingering && !lingerNaggedRef.current.has(current)) {
        lingerNaggedRef.current.add(current);
        say(LINGER_LINES[current % LINGER_LINES.length]);
      }
    },
    done ? null : 1_000
  );

  function goTo(step: number) {
    enteredAtRef.current = Date.now();
    setCurrent(step);
  }

  function handleNext() {
    const elapsed = Date.now() - enteredAtRef.current;
    if (elapsed < pacing.rushed) {
      setRushed((n) => n + 1);
      say(RUSHED_LINES[rushed % RUSHED_LINES.length]);
    }
    if (current === steps.length - 1) {
      setDone(true);
      say('Wow. You actually finished.');
      const card = cardRef.current;
      if (card) {
        const rect = card.getBoundingClientRect();
        confetti({
          particleCount: 40,
          spread: 70,
          startVelocity: 32,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
          disableForReducedMotion: true,
        });
      }
      onComplete?.();
    } else {
      goTo(current + 1);
    }
  }

  function handleBack() {
    if (current === 0) return;
    setGasps((n) => n + 1);
    say(GASP_LINES[gasps % GASP_LINES.length]);
    goTo(current - 1);
  }

  function handleRestart() {
    lingerNaggedRef.current.clear();
    setDone(false);
    goTo(0);
  }

  return (
    <div
      ref={cardRef}
      className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm"
    >
      <ol className="flex items-center gap-1" aria-label="Progress">
        {steps.map((step, i) => {
          const reached = i < current || done;
          const active = i === current && !done;
          return (
            <li key={step.title} className="flex flex-1 items-center gap-1 last:flex-none">
              <span
                aria-current={active ? 'step' : undefined}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
                  reached
                    ? 'bg-emerald-500 text-white'
                    : active
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {reached ? '✓' : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span
                  className={`h-0.5 flex-1 rounded transition-colors ${
                    i < current || done
                      ? 'bg-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="relative mt-4 min-h-[5.5rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={done ? 'done' : current}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
          >
            {done ? (
              <>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  All done.
                </h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  You rushed {rushed} step{rushed === 1 ? '' : 's'} and made the stepper gasp{' '}
                  {gasps} time{gasps === 1 ? '' : 's'}. It will remember.
                </p>
              </>
            ) : (
              <>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {steps[current].title}
                </h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {steps[current].content}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="h-7" aria-live="polite">
        <AnimatePresence mode="wait">
          {comment && (
            <motion.p
              key={comment.id}
              initial={reducedMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="inline-block rounded-md bg-slate-800 dark:bg-slate-700 px-2.5 py-1 text-xs font-medium text-white shadow-md"
            >
              {comment.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex justify-between">
        {done ? (
          <button
            type="button"
            onClick={handleRestart}
            className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Start over (it judges from the top)
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleBack}
              disabled={current === 0}
              className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              {current === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
