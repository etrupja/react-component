import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInterval } from '../../hooks/useInterval';
import { usePersonalityStat } from '../ComponentShowcase/PersonalityStatContext';

export type MoodRingColorPickerProps = {
  onColorChange?: (color: string, name: string) => void;
  initialColor?: string;
};

export const metadata = {
  name: 'Mood Ring Color Picker',
  description: 'A color picker that reads your vibe and names colors absurdly.',
  category: 'Inputs',
  tags: ['color', 'picker', 'humor', 'personality', 'input'],
};

type Vibe = 'chill' | 'neutral' | 'chaotic';

const ADJECTIVES = [
  'Tuesday Afternoon',
  'Forgot My Charger',
  'Mild Disappointment',
  'Aggressive Optimism',
  'I Skipped Breakfast',
  'Pre-Coffee',
  'Post-Yoga',
  'Slightly Underwater',
  'Generally Confused',
  'Suspiciously Calm',
  'Overcaffeinated',
  'Reluctantly Awake',
  'Quietly Furious',
  'Loudly Indifferent',
  'Vaguely Tropical',
  'Hopefully Yours',
  'Possibly Edible',
  'Definitely Not Mine',
  'Unfinished Business',
  'Borrowed Time',
  'Last Train Home',
  'Microwaved',
  'Lukewarm Take',
  'Unread Texts',
  'Group Chat Drama',
  'Sunday Scaries',
  'Voicemail Anxiety',
  'Wifi Probably Down',
  'Soft Launch',
  'Out Of Office',
];

const ENDINGS = [
  'Mauve',
  'Teal',
  'Pink',
  'Yellow',
  'Beige',
  'Crimson',
  'Sage',
  'Periwinkle',
  'Coral',
  'Mustard',
  'Lavender',
  'Indigo',
  'Salmon',
  'Olive',
  'Plum',
  'Mint',
  'Charcoal',
  'Ochre',
  'Lilac',
  'Vermillion',
  'Existential Dread',
  'Cobalt',
  'Apricot',
  'Eggshell',
  'Burgundy',
  'Chartreuse',
  'Magenta',
  'Slate',
  'Marigold',
  'Cerulean',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(): string {
  return `${pick(ADJECTIVES)} ${pick(ENDINGS)}`;
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return { h: 220, s: 80, l: 50 };
  const r = parseInt(m[1], 16) / 255;
  const g = parseInt(m[2], 16) / 255;
  const b = parseInt(m[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const VibeIcon = ({ vibe }: { vibe: Vibe }) => {
  if (vibe === 'chill') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-sky-500">
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M20 13.5a8 8 0 1 1-9.5-9.5A6 6 0 0 0 20 13.5z" />
      </svg>
    );
  }
  if (vibe === 'chaotic') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-fuchsia-500">
        <path fill="currentColor" d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-slate-500">
      <circle cx="12" cy="12" r="6" fill="currentColor" />
    </svg>
  );
};

function vibeFromRate(rate: number): Vibe {
  if (rate < 1) return 'chill';
  if (rate < 4) return 'neutral';
  return 'chaotic';
}

function vibeSuggestions(vibe: Vibe): string[] {
  if (vibe === 'chill') {
    return ['#f5d0c5', '#cfe1f7', '#d8ead0', '#f3e6c4', '#e5d4f0'];
  }
  if (vibe === 'chaotic') {
    return ['#ff007a', '#00f0ff', '#fff200', '#39ff14', '#ff5e00'];
  }
  return ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];
}

export default function MoodRingColorPicker({
  onColorChange,
  initialColor = '#3b82f6',
}: MoodRingColorPickerProps) {
  const initialHsl = useMemo(() => hexToHsl(initialColor), [initialColor]);
  const [hue, setHue] = useState(initialHsl.h);
  const [sat, setSat] = useState(initialHsl.s);
  const [light, setLight] = useState(initialHsl.l);
  const [name, setName] = useState<string>(() => generateName());
  const [vibe, setVibe] = useState<Vibe>('neutral');

  const surfaceRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const eventsRef = useRef<number[]>([]);
  const reducedMotion = useReducedMotion();

  const currentHex = useMemo(() => hslToHex(hue, sat, light), [hue, sat, light]);

  usePersonalityStat(
    `Current vibe: ${vibe[0].toUpperCase()}${vibe.slice(1)}`
  );

  function recordEvent() {
    const now = performance.now();
    eventsRef.current.push(now);
    eventsRef.current = eventsRef.current.filter((t) => now - t < 2000).slice(-10);
  }

  // Update vibe a few times a second based on recent activity
  useInterval(() => {
    const now = performance.now();
    const recent = eventsRef.current.filter((t) => now - t < 2000);
    setVibe(vibeFromRate(recent.length / 2));
  }, 400);

  const updateFromSurface = useCallback(
    (clientX: number, clientY: number) => {
      const el = surfaceRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
      const newSat = Math.round((x / rect.width) * 100);
      const newLight = Math.round(100 - (y / rect.height) * 100);
      setSat(newSat);
      setLight(newLight);
      recordEvent();
    },
    []
  );

  function handleSurfacePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromSurface(e.clientX, e.clientY);
  }
  function handleSurfacePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    updateFromSurface(e.clientX, e.clientY);
  }
  function endDrag() {
    draggingRef.current = false;
  }

  // Regenerate name when color settles for >120ms
  useEffect(() => {
    const t = window.setTimeout(() => {
      const newName = generateName();
      setName(newName);
      onColorChange?.(currentHex, newName);
    }, 120);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHex]);

  const containerBg =
    vibe === 'chill'
      ? 'bg-sky-50/60 dark:bg-slate-900/60'
      : vibe === 'chaotic'
        ? 'bg-fuchsia-50/60 dark:bg-fuchsia-900/20'
        : 'bg-slate-50 dark:bg-slate-900';

  const transitionMs = vibe === 'chill' ? 600 : vibe === 'chaotic' ? 80 : 240;

  return (
    <motion.div
      className={`w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 p-4 ${containerBg}`}
      animate={
        vibe === 'chaotic' && !reducedMotion
          ? { boxShadow: ['0 0 0 0 rgba(244,114,182,0)', '0 0 0 6px rgba(244,114,182,0.15)', '0 0 0 0 rgba(244,114,182,0)'] }
          : { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }
      }
      transition={vibe === 'chaotic' && !reducedMotion ? { duration: 1.2, repeat: Infinity } : { duration: 0.4 }}
    >
      <div
        ref={surfaceRef}
        onPointerDown={handleSurfacePointerDown}
        onPointerMove={handleSurfacePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative h-44 w-full rounded-md overflow-hidden cursor-crosshair touch-none"
        style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
        role="application"
        aria-label="Saturation and lightness picker"
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, #fff, transparent)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #000, transparent)' }}
        />
        <div
          className="absolute h-3 w-3 rounded-full border-2 border-white shadow-md pointer-events-none"
          style={{
            left: `${sat}%`,
            top: `${100 - light}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="mt-3">
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">Hue</label>
        <input
          type="range"
          min={0}
          max={360}
          value={hue}
          onChange={(e) => {
            setHue(Number(e.target.value));
            recordEvent();
          }}
          className="mood-hue-slider w-full mt-1"
          aria-label="Hue"
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <motion.div
          className="h-12 w-12 rounded-lg border border-slate-300 dark:border-slate-600 shadow-inner shrink-0"
          animate={{ backgroundColor: currentHex }}
          transition={{ duration: transitionMs / 1000 }}
        />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{currentHex}</div>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
          <VibeIcon vibe={vibe} />
          <span className="capitalize">{vibe}</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">
          {vibe === 'chill' ? 'Maybe try a pastel' : vibe === 'chaotic' ? 'Or go fully feral' : 'Some suggestions'}
        </div>
        <div className="flex gap-2">
          {vibeSuggestions(vibe).map((c) => {
            const hsl = hexToHsl(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setHue(hsl.h);
                  setSat(hsl.s);
                  setLight(hsl.l);
                  recordEvent();
                }}
                className="h-7 w-7 rounded-md border border-slate-300 dark:border-slate-600 shadow-sm transition-transform hover:scale-110"
                style={{ backgroundColor: c }}
                aria-label={`Pick ${c}`}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
