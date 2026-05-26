import React from 'react';
import { RESLUG_MAP } from './reslug-map';

/**
 * Rewrite an outbound URL through the team's ReSlug shortener.
 *
 * - If `slug` is passed explicitly, it's used directly.
 * - Otherwise, look up `url` in RESLUG_MAP. Found → rewrite. Missing → return
 *   the original URL unchanged. Never throws.
 *
 * This helper is intentionally permissive: it doesn't know about third-party
 * docs or sponsor links. Use the `<ReslugLink>` component (or the same logic
 * at the call site) to decide *whether* to rewrite.
 */
export function toReslug(url: string, slug?: string): string {
  if (slug) return `https://${stripScheme(slug)}`;
  const mapped = RESLUG_MAP[url];
  if (mapped) return `https://${stripScheme(mapped)}`;
  return url;
}

function stripScheme(s: string): string {
  return s.replace(/^https?:\/\//i, '');
}

export type ReslugLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  /** Optional explicit slug override (e.g. "reslug.com/promo"). */
  slug?: string;
  /** Set true on third-party sponsor links to opt out of rewriting. */
  'data-sponsor'?: boolean | 'true' | 'false';
};

/**
 * Anchor wrapper that routes through ReSlug when a slug is known.
 * - Sponsor links (`data-sponsor`) are passed through untouched.
 * - Adds `data-reslug="true"` when the link was actually rewritten, for
 *   analytics debugging.
 */
export function ReslugLink({ href, slug, children, ...rest }: ReslugLinkProps) {
  const sponsor =
    rest['data-sponsor'] === true || rest['data-sponsor'] === 'true';

  if (sponsor) {
    return React.createElement('a', { href, ...rest }, children);
  }

  const rewritten = toReslug(href, slug);
  const wasRewritten = rewritten !== href;

  return React.createElement(
    'a',
    {
      href: rewritten,
      ...rest,
      ...(wasRewritten ? { 'data-reslug': 'true' } : {}),
    },
    children
  );
}
