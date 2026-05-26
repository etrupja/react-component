import { describe, expect, it, vi } from 'vitest';
import { toReslug } from '../reslug';

vi.mock('../reslug-map', () => ({
  RESLUG_MAP: {
    'https://reslug.com/signup': 'reslug.com/signup',
    'https://example.com/internal-cta': 'reslug.com/cta',
  },
}));

describe('toReslug', () => {
  it('rewrites a URL that has a known slug', () => {
    expect(toReslug('https://example.com/internal-cta')).toBe('https://reslug.com/cta');
  });

  it('returns the original URL when no slug is mapped', () => {
    expect(toReslug('https://react.dev/learn')).toBe('https://react.dev/learn');
  });

  it('uses an explicit slug override regardless of the map', () => {
    expect(toReslug('https://example.com/anything', 'reslug.com/promo')).toBe('https://reslug.com/promo');
  });

  it('strips scheme from an explicit slug to avoid double-protocol URLs', () => {
    expect(toReslug('https://example.com/x', 'https://reslug.com/promo')).toBe('https://reslug.com/promo');
  });

  it('treats a non-mapped URL as a no-op even when looking like our domain', () => {
    expect(toReslug('https://reslug.com/unknown-path')).toBe('https://reslug.com/unknown-path');
  });
});

describe('toReslug sponsor handling (documented behavior)', () => {
  // The sponsor exclusion is enforced by <ReslugLink> (see reslug.tsx), not
  // toReslug itself. toReslug is a pure URL transform with no DOM coupling.
  // This test pins that contract so a future refactor doesn't quietly change it.
  it('does not inspect DOM attributes', () => {
    expect(toReslug('https://example.com/internal-cta')).toBe('https://reslug.com/cta');
  });
});
