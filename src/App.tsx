import React, { ComponentType, useMemo, useState } from 'react';
import './App.css';
import { MonkeyLoginForm } from './components/LoginForms';
import { useTheme } from './hooks/useTheme';
import ComponentShowcase, { ShowcaseMetadata } from './components/ComponentShowcase';

import monkeyLoginSource from './components/LoginForms/MonkeyLoginForm.tsx?raw';
import monkeyLoginUsage from './components/LoginForms/MonkeyLoginForm.usage.md?raw';

import InteractiveProgressBarDemo from './components/InteractiveProgressBar/InteractiveProgressBar.demo';
import progressBarSource from './components/InteractiveProgressBar/InteractiveProgressBar.tsx?raw';
import progressBarUsage from './components/InteractiveProgressBar/InteractiveProgressBar.usage.md?raw';

import GrumpyFormValidator, {
  metadata as grumpyMetadata,
} from './components/GrumpyFormValidator';
import grumpySource from './components/GrumpyFormValidator/index.tsx?raw';
import grumpyUsage from './components/GrumpyFormValidator/GrumpyFormValidator.usage.md?raw';

import TrustFallButton, {
  metadata as trustFallMetadata,
} from './components/TrustFallButton';
import trustFallSource from './components/TrustFallButton/index.tsx?raw';
import trustFallUsage from './components/TrustFallButton/TrustFallButton.usage.md?raw';

import ProcrastinatorTodoList, {
  metadata as procrastinatorMetadata,
} from './components/ProcrastinatorTodoList';
import procrastinatorSource from './components/ProcrastinatorTodoList/index.tsx?raw';
import procrastinatorUsage from './components/ProcrastinatorTodoList/ProcrastinatorTodoList.usage.md?raw';

import MoodRingColorPicker, {
  metadata as moodRingMetadata,
} from './components/MoodRingColorPicker';
import moodRingSource from './components/MoodRingColorPicker/index.tsx?raw';
import moodRingUsage from './components/MoodRingColorPicker/MoodRingColorPicker.usage.md?raw';

import SentientSearchBar, {
  metadata as sentientSearchMetadata,
} from './components/SentientSearchBar';
import sentientSearchSource from './components/SentientSearchBar/index.tsx?raw';
import sentientSearchUsage from './components/SentientSearchBar/SentientSearchBar.usage.md?raw';

type ShowcaseEntry = {
  id: string;
  component: ComponentType<any>;
  componentProps?: Record<string, unknown>;
  source: string;
  usage: string;
  metadata: ShowcaseMetadata;
};

const ENTRIES: ShowcaseEntry[] = [
  {
    id: 'monkey-login',
    component: MonkeyLoginForm,
    componentProps: {
      onSubmit: (username: string, password: string) =>
        console.log('Login attempt:', { username, password }),
    },
    source: monkeyLoginSource,
    usage: monkeyLoginUsage,
    metadata: {
      name: 'Monkey Login Form',
      description: 'An animated monkey-themed login form with interactive elements.',
      category: 'Forms',
      tags: ['form', 'login', 'animation', 'svg'],
    },
  },
  {
    id: 'progress-bar',
    component: InteractiveProgressBarDemo,
    source: progressBarSource,
    usage: progressBarUsage,
    metadata: {
      name: 'Interactive Progress Bar',
      description: 'A customizable progress bar with multiple themes and confetti celebration.',
      category: 'Feedback',
      tags: ['progress', 'animation', 'confetti', 'theme'],
    },
  },
  {
    id: 'grumpy-form',
    component: GrumpyFormValidator,
    source: grumpySource,
    usage: grumpyUsage,
    metadata: grumpyMetadata,
  },
  {
    id: 'trust-fall',
    component: TrustFallButton,
    componentProps: {
      onConfirm: () => console.log('Trust fall confirmed'),
    },
    source: trustFallSource,
    usage: trustFallUsage,
    metadata: trustFallMetadata,
  },
  {
    id: 'procrastinator',
    component: ProcrastinatorTodoList,
    componentProps: {
      ageThresholds: { stale: 10_000, annoyed: 20_000, furious: 40_000 },
      storageKey: 'procrastinator-todos-demo',
    },
    source: procrastinatorSource,
    usage: procrastinatorUsage,
    metadata: procrastinatorMetadata,
  },
  {
    id: 'mood-ring',
    component: MoodRingColorPicker,
    source: moodRingSource,
    usage: moodRingUsage,
    metadata: moodRingMetadata,
  },
  {
    id: 'sentient-search',
    component: SentientSearchBar,
    componentProps: {
      onSearch: (q: string) => console.log('search:', q),
    },
    source: sentientSearchSource,
    usage: sentientSearchUsage,
    metadata: sentientSearchMetadata,
  },
];

function App() {
  const { theme: appTheme, toggle: toggleTheme } = useTheme();
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const e of ENTRIES) {
      if (e.metadata.category) set.add(e.metadata.category);
    }
    return ['All', ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ENTRIES.filter((e) => {
      if (category !== 'All' && e.metadata.category !== category) return false;
      if (!q) return true;
      if (e.metadata.name.toLowerCase().includes(q)) return true;
      if (e.metadata.tags?.some((t) => t.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [category, search]);

  return (
    <div className="App">
      <header className="App-header">
        <nav className="nav-left">
          <span className="nav-brand">RCS</span>
          <a href="#components" className="nav-link">
            Components
          </a>
          <a href="#docs" className="nav-link">
            Docs
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
        </nav>
        <div className="nav-right">
          <div className="nav-text">
            <h3>React Component Showcase</h3>
            <p>A collection of interactive React components</p>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${appTheme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${appTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {appTheme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </header>

      <div className="showcase-controls">
        <div className="category-chips" role="tablist" aria-label="Filter by category">
          {categories.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(c)}
                className={`category-chip ${active ? 'is-active' : ''}`}
              >
                {c}
              </button>
            );
          })}
        </div>
        <div className="search-wrap">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or tag…"
            aria-label="Search components"
            className="showcase-search"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="showcase-empty">
          No components match "{search}"
          {category !== 'All' ? ` in ${category}` : ''}.
        </div>
      ) : (
        <div className="component-showcase" id="components">
          {filtered.map((e) => (
            <ComponentShowcase
              key={e.id}
              component={e.component}
              componentProps={e.componentProps}
              source={e.source}
              usage={e.usage}
              metadata={e.metadata}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
