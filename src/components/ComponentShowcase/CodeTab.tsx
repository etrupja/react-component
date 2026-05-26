import React, { useEffect, useState } from 'react';
import { highlight } from './highlighter';

type Props = {
  source: string;
  language?: string;
  repoUrl?: string;
};

const CopyIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 9h10v12H9zM5 15V3h10v3"
    />
  </svg>
);

const ExternalIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 4h6v6M10 14L20 4M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"
    />
  </svg>
);

export default function CodeTab({ source, language = 'tsx', repoUrl }: Props) {
  const [html, setHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    highlight(source, language).then((h) => {
      if (!cancelled) setHtml(h);
    });
    return () => {
      cancelled = true;
    };
  }, [source, language]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be blocked; silently ignore
    }
  }

  return (
    <div className="relative">
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            title="View on GitHub"
          >
            {ExternalIcon}
            GitHub
          </a>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          title="Copy source"
          aria-live="polite"
        >
          {CopyIcon}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {html ? (
        <div
          className="shiki-block max-h-[520px] overflow-auto text-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="p-6 min-h-[320px] bg-slate-50 dark:bg-slate-900 text-sm text-slate-500 dark:text-slate-400">
          Highlighting…
        </div>
      )}
    </div>
  );
}
