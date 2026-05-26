import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';

import githubLight from 'shiki/themes/github-light.mjs';
import githubDark from 'shiki/themes/github-dark.mjs';

import tsx from 'shiki/langs/tsx.mjs';
import ts from 'shiki/langs/typescript.mjs';
import jsx from 'shiki/langs/jsx.mjs';
import js from 'shiki/langs/javascript.mjs';
import css from 'shiki/langs/css.mjs';
import json from 'shiki/langs/json.mjs';
import bash from 'shiki/langs/bash.mjs';
import md from 'shiki/langs/markdown.mjs';

const LANG_ALIASES: Record<string, string> = {
  ts: 'typescript',
  typescript: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  javascript: 'javascript',
  jsx: 'jsx',
  css: 'css',
  json: 'json',
  sh: 'bash',
  bash: 'bash',
  shell: 'bash',
  md: 'markdown',
  markdown: 'markdown',
};

let highlighterPromise: Promise<HighlighterCore> | null = null;

export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubLight, githubDark],
      langs: [tsx, ts, jsx, js, css, json, bash, md],
      engine: createOnigurumaEngine(() => import('shiki/wasm')),
    });
  }
  return highlighterPromise;
}

export async function highlight(code: string, lang = 'tsx'): Promise<string> {
  const hl = await getHighlighter();
  const resolved = LANG_ALIASES[lang] || 'tsx';
  return hl.codeToHtml(code, {
    lang: resolved,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  });
}
