import React, { useState, ComponentType } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import TabBar, { TabId } from './TabBar';
import PreviewTab from './PreviewTab';
import CodeTab from './CodeTab';
import UsageTab from './UsageTab';
import { PersonalityStatProvider, useDynamicStatSlot } from './PersonalityStatContext';

export type ShowcaseMetadata = {
  name: string;
  description: string;
  category?: string;
  tags?: string[];
};

type Props = {
  component: ComponentType<any>;
  componentProps?: Record<string, unknown>;
  source: string;
  usage: string;
  metadata: ShowcaseMetadata;
  repoUrl?: string;
  personalityStat?: React.ReactNode;
  language?: string;
};

export default function ComponentShowcase({
  component,
  componentProps,
  source,
  usage,
  metadata,
  repoUrl,
  personalityStat,
  language = 'tsx',
}: Props) {
  const [tab, setTab] = useState<TabId>('preview');
  const [copiedSource, setCopiedSource] = useState(false);
  const reducedMotion = useReducedMotion();
  const { stat: dynamicStat, setStat: setDynamicStat } = useDynamicStatSlot();
  const displayStat = dynamicStat ?? personalityStat;

  const tabVariants = reducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      };

  async function handleFooterCopy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopiedSource(true);
      setTimeout(() => setCopiedSource(false), 1500);
    } catch {}
  }

  return (
    <article className="text-left flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
      <header className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="text-left min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
            {metadata.name}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {metadata.description}
          </p>
        </div>
        {metadata.category && (
          <span className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 text-xs px-2.5 py-1 font-medium text-slate-700 dark:text-slate-300">
            {metadata.category}
          </span>
        )}
      </header>

      <TabBar tab={tab} onChange={setTab} />

      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {tab === 'preview' && (
              <PersonalityStatProvider onChange={setDynamicStat}>
                <PreviewTab component={component} componentProps={componentProps} />
              </PersonalityStatProvider>
            )}
            {tab === 'code' && (
              <CodeTab source={source} language={language} repoUrl={repoUrl} />
            )}
            {tab === 'usage' && <UsageTab usage={usage} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {(displayStat || repoUrl) && (
        <footer className="flex items-center justify-between gap-3 px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="text-xs text-slate-600 dark:text-slate-400 min-w-0 truncate">
            {displayStat}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFooterCopy}
              className="text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-live="polite"
            >
              {copiedSource ? 'Copied!' : 'Copy'}
            </button>
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Source
              </a>
            )}
          </div>
        </footer>
      )}
    </article>
  );
}
