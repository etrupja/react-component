import React from 'react';

export default function Docs() {
  return (
    <section aria-labelledby="docs-heading" className="page-section">
      <div className="page-section-inner">
        <header className="page-section-header">
          <h2 id="docs-heading">Docs</h2>
          <p>How the showcase works and how to add your own component.</p>
        </header>

        <div className="page-section-prose">
          <h3>Showcase shell</h3>
          <p>
            Every component is wrapped in <code>&lt;ComponentShowcase&gt;</code>, which gives it
            three tabs:
          </p>
          <ul>
            <li>
              <strong>Preview</strong> — the live component inside a stage with a Reset button
              that remounts to replay animations.
            </li>
            <li>
              <strong>Code</strong> — the component source, syntax-highlighted by shiki with a
              Copy button. Same HTML renders in light and dark mode via CSS variables.
            </li>
            <li>
              <strong>Usage</strong> — markdown rendered with react-markdown + remark-gfm;
              fenced code blocks are highlighted the same way.
            </li>
          </ul>
          <p>
            Tabs are keyboard-navigable: focus the tab list and use <kbd>←</kbd> <kbd>→</kbd>,{' '}
            <kbd>Home</kbd>, <kbd>End</kbd>.
          </p>

          <h3>Adding a new component</h3>
          <ol>
            <li>
              Create <code>src/components/&lt;Name&gt;/index.tsx</code>. Export your component
              as the <code>default</code> and a named <code>metadata</code> object with{' '}
              <code>name</code>, <code>description</code>, <code>category</code>, and{' '}
              <code>tags</code>.
            </li>
            <li>
              Write <code>&lt;Name&gt;.usage.md</code> next to it. Headings, prop tables,
              gotchas, and accessibility notes go here.
            </li>
            <li>
              In <code>src/pages/Home.tsx</code>, add an entry to the <code>ENTRIES</code>{' '}
              array with <code>?raw</code> imports of the component source and the usage
              markdown.
            </li>
            <li>
              Need surrounding controls? Ship a <code>&lt;Name&gt;.demo.tsx</code> wrapper and
              pass that as the showcase component (see the Interactive Progress Bar).
            </li>
          </ol>
          <p>
            The landing page picks up category filter + name/tag search automatically from
            the entry's metadata.
          </p>

          <h3>Personality stats</h3>
          <p>
            The footer of each showcase card can show a live "personality stat". Components
            can publish their own by calling:
          </p>
          <pre>
            <code>{"import { usePersonalityStat } from '.../ComponentShowcase/PersonalityStatContext';\n\nusePersonalityStat(`Annoyance level: ${count} / ${max}`);"}</code>
          </pre>
          <p>
            Outside the showcase the hook is a no-op, so components stay drop-in usable in
            real apps.
          </p>

          <h3>Conventions</h3>
          <ul>
            <li>New components are written with Tailwind classes; existing ones still use plain CSS files.</li>
            <li>All animations honor <code>prefers-reduced-motion</code>.</li>
            <li>Source for the Code tab is loaded via Vite's <code>?raw</code> import suffix.</li>
            <li>Dark mode is toggled on <code>&lt;html class="dark"&gt;</code>; theme persists in <code>localStorage</code>.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
