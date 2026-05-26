import React, { useState } from 'react';

const STORAGE_KEY = 'reslug_banner_dismissed_v1';
const RESHOW_AFTER_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function shouldShowInitially(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return true;
    return Date.now() - ts > RESHOW_AFTER_MS;
  } catch {
    return true;
  }
}

export default function ReSlugBanner() {
  // Initialize from localStorage synchronously so there's no flash / layout shift.
  const [visible, setVisible] = useState<boolean>(shouldShowInitially);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // localStorage may be unavailable (private mode, quota); fall through silently.
    }
  }

  if (!visible) return null;

  return (
    <div className="reslug-banner" role="region" aria-label="ReSlug promotion">
      <p className="reslug-banner-text">
        Built by the same team:{' '}
        <strong>ReSlug</strong>, link management without the upsell wall. Try it free.
      </p>
      <a
        href="https://reslug.link/nvgBb4r"
        target="_blank"
        rel="noopener nofollow"
        className="reslug-banner-cta"
        data-reslug="true"
      >
        Open ReSlug
      </a>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss ReSlug banner"
        className="reslug-banner-dismiss"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" width="14" height="14">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M6 6l12 12M18 6L6 18"
          />
        </svg>
      </button>
    </div>
  );
}
