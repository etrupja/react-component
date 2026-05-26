import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useInterval } from '../../hooks/useInterval';
import { usePersonalityStat } from '../ComponentShowcase/PersonalityStatContext';

export type ProcrastinatorTodoListProps = {
  ageThresholds?: { stale: number; annoyed: number; furious: number };
  storageKey?: string;
};

export const metadata = {
  name: "Procrastinator's To-Do List",
  description: 'A todo list where ignored tasks visibly complain and demand attention.',
  category: 'Lists',
  tags: ['list', 'todo', 'humor', 'personality', 'storage'],
};

type Task = {
  id: string;
  text: string;
  createdAt: number;
};

type Stage = 'fresh' | 'stale' | 'annoyed' | 'furious';

const DEFAULT_THRESHOLDS = {
  stale: 60_000,
  annoyed: 120_000,
  furious: 240_000,
};

const COMPLAINTS = [
  'Hello??',
  "I've been here a while.",
  'Just do me already.',
  'Am I a joke to you?',
];

function stageFor(age: number, t: ProcrastinatorTodoListProps['ageThresholds']): Stage {
  const th = t ?? DEFAULT_THRESHOLDS;
  if (age >= th.furious) return 'furious';
  if (age >= th.annoyed) return 'annoyed';
  if (age >= th.stale) return 'stale';
  return 'fresh';
}

const FrownIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-amber-600 dark:text-amber-400">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="9" cy="10" r="1" fill="currentColor" />
    <circle cx="15" cy="10" r="1" fill="currentColor" />
    <path d="M8 16c2-2 6-2 8 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AngryIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-rose-600 dark:text-rose-400">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M7 9l3 1M17 9l-3 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="9.5" cy="11" r="1" fill="currentColor" />
    <circle cx="14.5" cy="11" r="1" fill="currentColor" />
    <path d="M8 17c2-2 6-2 8 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const WaveHand = (
  <motion.svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="h-4 w-4 text-amber-500"
    initial={{ rotate: -15 }}
    animate={{ rotate: [-15, 25, -10, 20, 0] }}
    transition={{ duration: 0.6 }}
  >
    <path
      fill="currentColor"
      d="M7 10V5a1.5 1.5 0 1 1 3 0v4M10 9V4a1.5 1.5 0 1 1 3 0v5M13 9V5a1.5 1.5 0 1 1 3 0v5M16 10V7a1.5 1.5 0 1 1 3 0v7a6 6 0 0 1-12 0v-1l-2-3a1.5 1.5 0 0 1 2.5-1.5L9 11"
    />
  </motion.svg>
);

function makeId() {
  return `t_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function loadStored(storageKey: string): Task[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t: any): t is Task =>
        t && typeof t.id === 'string' && typeof t.text === 'string' && typeof t.createdAt === 'number'
    );
  } catch {
    return [];
  }
}

export default function ProcrastinatorTodoList({
  ageThresholds = DEFAULT_THRESHOLDS,
  storageKey = 'procrastinator-todos',
}: ProcrastinatorTodoListProps) {
  const [tasks, setTasks] = useState<Task[]>(() => loadStored(storageKey));
  const [input, setInput] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [waving, setWaving] = useState<Set<string>>(() => new Set());
  const reducedMotion = useReducedMotion();
  const itemRefs = useRef(new Map<string, HTMLLIElement>());

  // Re-render every 2s to advance aging + rotate complaints
  useInterval(() => setNow(Date.now()), 2000);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch {}
  }, [tasks, storageKey]);

  const sorted = useMemo(() => {
    const withStage = tasks.map((t) => ({ task: t, stage: stageFor(now - t.createdAt, ageThresholds) }));
    return withStage.sort((a, b) => {
      if (a.stage === 'furious' && b.stage !== 'furious') return -1;
      if (b.stage === 'furious' && a.stage !== 'furious') return 1;
      return a.task.createdAt - b.task.createdAt;
    });
  }, [tasks, now, ageThresholds]);

  const stats = useMemo(() => {
    let ignored = 0;
    let oldest = 0;
    for (const t of tasks) {
      const age = now - t.createdAt;
      if (age >= ageThresholds.stale) ignored++;
      if (age > oldest) oldest = age;
    }
    return { ignored, oldestMin: Math.floor(oldest / 60_000) };
  }, [tasks, now, ageThresholds]);

  usePersonalityStat(
    tasks.length === 0
      ? 'No tasks. Suspicious.'
      : `Tasks ignored: ${stats.ignored} | Oldest: ${stats.oldestMin} min`
  );

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [...prev, { id: makeId(), text, createdAt: Date.now() }]);
    setInput('');
  }

  function handleComplete(id: string) {
    const li = itemRefs.current.get(id);
    if (li) {
      const rect = li.getBoundingClientRect();
      confetti({
        particleCount: 28,
        spread: 55,
        startVelocity: 30,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        disableForReducedMotion: true,
      });
    }
    setWaving((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    window.setTimeout(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setWaving((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      itemRefs.current.delete(id);
    }, 550);
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
        Things you said you'd do
      </h3>

      <form onSubmit={handleAdd} className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What are you putting off?"
          className="flex-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="New task"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </form>

      <ul className="mt-4 space-y-2 min-h-[3rem]">
        <AnimatePresence initial={false}>
          {sorted.length === 0 && (
            <motion.li
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs italic text-slate-400 dark:text-slate-500 py-2"
            >
              Nothing here. Suspicious for a procrastinator.
            </motion.li>
          )}

          {sorted.map(({ task, stage }) => {
            const stageStyle =
              stage === 'furious'
                ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700'
                : stage === 'annoyed'
                  ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700'
                  : stage === 'stale'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700';

            const wiggleClass =
              stage === 'furious'
                ? 'procrastinator-furious'
                : stage === 'annoyed'
                  ? 'procrastinator-annoyed'
                  : stage === 'stale'
                    ? 'procrastinator-stale'
                    : '';

            const complaintIdx =
              (Math.floor(now / 3500) + task.id.charCodeAt(2 % task.id.length)) % COMPLAINTS.length;

            return (
              <motion.li
                key={task.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(task.id, el);
                }}
                layout={!reducedMotion}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 30, transition: { duration: 0.4 } }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="relative"
              >
                <div className={`flex items-center gap-2 rounded-md border px-3 py-2 ${stageStyle} ${wiggleClass}`}>
                  <input
                    id={`task-${task.id}`}
                    type="checkbox"
                    onChange={() => handleComplete(task.id)}
                    className="h-4 w-4 rounded border-slate-300"
                    aria-label={`Complete task: ${task.text}`}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className="flex-1 text-sm text-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    {task.text}
                  </label>
                  {stage === 'annoyed' && !waving.has(task.id) && FrownIcon}
                  {stage === 'furious' && !waving.has(task.id) && AngryIcon}
                  {waving.has(task.id) && WaveHand}
                </div>

                {stage === 'furious' && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={complaintIdx}
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      transition={{ duration: 0.18 }}
                      className="absolute -right-1 -top-3 rounded-md bg-rose-600 px-1.5 py-0.5 text-[10px] font-medium text-white shadow"
                    >
                      {COMPLAINTS[complaintIdx]}
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
