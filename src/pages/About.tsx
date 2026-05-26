import React from 'react';

export default function About() {
  return (
    <section aria-labelledby="about-heading" className="page-section">
      <div className="page-section-inner">
        <header className="page-section-header">
          <h2 id="about-heading">About</h2>
          <p>What this is and how it's built.</p>
        </header>

        <div className="page-section-prose">
          <h3>The project</h3>
          <p>
            A small showcase of interactive React components — some practical, some
            personality-driven (a form that gets annoyed at typos, a button that visibly
            panics, a todo list whose tasks complain when ignored). Each one is presented with
            a live preview, the full source, and usage notes.
          </p>
          <p>
            The goal is to share components that are useful as drop-ins <em>and</em> fun to
            read — the kind of code that has a point of view.
          </p>

          <h3>Stack</h3>
          <ul>
            <li><strong>React 19</strong> + <strong>TypeScript</strong> (strict)</li>
            <li><strong>Vite</strong> for the build, with <code>?raw</code> imports for source viewing</li>
            <li><strong>React Router</strong> for routing</li>
            <li><strong>Tailwind CSS</strong> for newer components</li>
            <li><strong>Framer Motion</strong> for animation</li>
            <li><strong>shiki</strong> for syntax highlighting (dual-theme, CSS-variable swap)</li>
            <li><strong>canvas-confetti</strong> where confetti is genuinely needed</li>
            <li><strong>Vitest</strong> for unit tests</li>
            <li>Deployed to <strong>Cloudflare Pages</strong></li>
          </ul>

          <h3>Conventions worth borrowing</h3>
          <ul>
            <li>Components are self-contained — no external state, animations included.</li>
            <li>Every animation respects <code>prefers-reduced-motion</code>.</li>
            <li>Keyboard navigation is real, not bolted on after.</li>
            <li>Dark mode is a class on <code>&lt;html&gt;</code>, decided at first paint to avoid flash.</li>
          </ul>

          <h3>Use anything</h3>
          <p>
            Everything here is fair game. Copy a component, fork the showcase shell, lift the
            syntax-highlighter setup — go for it. If you build something with these, send a
            link.
          </p>
        </div>
      </div>
    </section>
  );
}
