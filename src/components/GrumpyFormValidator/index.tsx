import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { usePersonalityStat } from '../ComponentShowcase/PersonalityStatContext';

export type GrumpyFormValidatorProps = {
  onSuccess?: () => void;
  maxAnnoyance?: number;
};

export const metadata = {
  name: 'Grumpy Form Validator',
  description: 'A form that gets progressively more annoyed at typos.',
  category: 'Forms',
  tags: ['form', 'validation', 'humor', 'personality'],
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string) {
  return EMAIL_RE.test(email) && password.length >= 6;
}

function errorFor(count: number, max: number): string {
  if (count <= 0) return '';
  if (count === 1) return 'Hmm, check that email.';
  if (count === 2) return 'Still not right.';
  if (count === 3) return 'Are you even trying right now?';
  if (count === 4) return "I'll wait.";
  if (count < max) return '. . .';
  return 'Fine. Whatever.';
}

const SighIcon = (
  <motion.svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="inline-block h-3.5 w-3.5 ml-1 text-slate-400"
    initial={{ y: 0, opacity: 0.5 }}
    animate={{ y: [-1, -4, -1], opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      d="M4 14c2-3 4-3 6 0s4 3 6 0 4-3 4 0"
    />
  </motion.svg>
);

export default function GrumpyFormValidator({
  onSuccess,
  maxAnnoyance = 5,
}: GrumpyFormValidatorProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mistakeCount, setMistakeCount] = useState(0);
  const [apology, setApology] = useState(false);
  const [success, setSuccess] = useState(false);

  const lastCountedRef = useRef<string>('');
  const apologyTimerRef = useRef<number | null>(null);
  const buttonAnchorRef = useRef<HTMLDivElement>(null);
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  // Publish the annoyance level to the showcase footer (no-op outside it)
  usePersonalityStat(
    success
      ? 'Successfully logged in. Finally.'
      : `Annoyance level: ${mistakeCount} / ${maxAnnoyance}`
  );

  // Debounced mistake counting + sorry easter egg
  useEffect(() => {
    if (!email && !password) return;

    const hasSorry =
      email.toLowerCase().includes('sorry') ||
      password.toLowerCase().includes('sorry');

    if (hasSorry) {
      if (mistakeCount > 0) {
        setMistakeCount(0);
        setApology(true);
        if (apologyTimerRef.current) window.clearTimeout(apologyTimerRef.current);
        apologyTimerRef.current = window.setTimeout(() => setApology(false), 2000);
      }
      return;
    }

    const key = `${email}|${password}`;
    const t = window.setTimeout(() => {
      if (!validate(email, password) && key !== lastCountedRef.current) {
        lastCountedRef.current = key;
        setMistakeCount((c) => Math.min(c + 1, maxAnnoyance));
      }
    }, 600);
    return () => window.clearTimeout(t);
  }, [email, password, maxAnnoyance, mistakeCount]);

  useEffect(() => {
    return () => {
      if (apologyTimerRef.current) window.clearTimeout(apologyTimerRef.current);
    };
  }, []);

  // Submit button dodge
  function handleMouseMove(e: React.MouseEvent) {
    if (reducedMotion || mistakeCount < 3 || success) return;
    const anchor = buttonAnchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < 80) {
      const angle = Math.atan2(dy, dx);
      const push = 60;
      setButtonOffset({ x: -Math.cos(angle) * push, y: -Math.sin(angle) * push });
    } else if (dist > 140) {
      setButtonOffset({ x: 0, y: 0 });
    }
  }

  function handleMouseLeave() {
    setButtonOffset({ x: 0, y: 0 });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate(email, password)) {
      setSuccess(true);
      onSuccess?.();
    } else {
      // Count an extra mistake for trying to submit invalid
      const key = `submit|${email}|${password}`;
      if (key !== lastCountedRef.current) {
        lastCountedRef.current = key;
        setMistakeCount((c) => Math.min(c + 1, maxAnnoyance));
      }
    }
  }

  const errorMessage = errorFor(mistakeCount, maxAnnoyance);
  const meterRatio = Math.min(mistakeCount / maxAnnoyance, 1);
  const hue = Math.round(120 - meterRatio * 120);
  const meterColor = `hsl(${hue}, 75%, 50%)`;
  const isMax = mistakeCount >= maxAnnoyance;

  return (
    <form
      onSubmit={handleSubmit}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm select-none"
      aria-label="Grumpy login form"
    >
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
        Log in
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
        Try a few wrong ones. Or type "sorry".
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <label
            htmlFor="grumpy-email"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Email
          </label>
          <input
            id="grumpy-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={success}
            className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            autoComplete="off"
            aria-invalid={mistakeCount > 0}
          />
        </div>
        <div>
          <label
            htmlFor="grumpy-password"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Password
          </label>
          <input
            id="grumpy-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={success}
            className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            autoComplete="off"
            aria-invalid={mistakeCount > 0}
          />
        </div>
      </div>

      <div
        className="mt-3 min-h-[1.25rem] text-xs"
        role="status"
        aria-live="polite"
      >
        {apology && (
          <span className="text-emerald-600 dark:text-emerald-400">
            Apology accepted.
          </span>
        )}
        {!apology && errorMessage && (
          <span className="text-rose-600 dark:text-rose-400">
            {errorMessage}
            {isMax && SighIcon}
          </span>
        )}
        {!apology && !errorMessage && success && (
          <span className="text-emerald-600 dark:text-emerald-400">
            You're in. Hooray.
          </span>
        )}
      </div>

      <div
        ref={buttonAnchorRef}
        className="relative mt-3 flex h-12 items-center justify-center"
      >
        <motion.div
          animate={{ x: buttonOffset.x, y: buttonOffset.y }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <motion.button
            type="submit"
            disabled={success}
            className="rounded-md bg-slate-900 dark:bg-slate-100 px-4 py-2 text-sm font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            animate={
              isMax && !reducedMotion
                ? { x: [0, -2, 2, -2, 2, 0] }
                : { x: 0 }
            }
            transition={
              isMax && !reducedMotion
                ? { duration: 0.45, repeat: Infinity, repeatDelay: 1.55 }
                : { duration: 0.2 }
            }
          >
            Submit
          </motion.button>
        </motion.div>
      </div>

      <div
        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
        role="progressbar"
        aria-label="Annoyance meter"
        aria-valuemin={0}
        aria-valuemax={maxAnnoyance}
        aria-valuenow={mistakeCount}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: meterColor }}
          animate={{ width: `${meterRatio * 100}%` }}
          transition={{ duration: reducedMotion ? 0 : 0.35, ease: 'easeOut' }}
        />
      </div>
    </form>
  );
}
