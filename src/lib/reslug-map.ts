/**
 * Map of original URLs → reslug.com slugs.
 * Add entries here as you create slugs in the ReSlug dashboard.
 *
 * Keys are exact original URLs. Values are reslug.com paths (host included,
 * no protocol), e.g. `'reslug.com/signup'`.
 *
 * NOTE on what NOT to add here:
 *   - Third-party docs (react.dev, mdn, github.com/facebook/*, etc.)
 *   - User-submitted content
 *   - Anything that should remain a direct link
 */
export const RESLUG_MAP: Record<string, string> = {
  // Example:
  // 'https://reslug.com/signup': 'reslug.com/signup',
};
