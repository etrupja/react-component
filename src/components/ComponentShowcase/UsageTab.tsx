import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { highlight } from './highlighter';

type Props = {
  usage: string;
};

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    highlight(value, language).then((h) => {
      if (!cancelled) setHtml(h);
    });
    return () => {
      cancelled = true;
    };
  }, [value, language]);

  if (!html) {
    return (
      <pre className="rounded-md bg-slate-100 dark:bg-slate-900 p-3 text-sm overflow-auto">
        <code>{value}</code>
      </pre>
    );
  }

  return (
    <div className="shiki-block rounded-md overflow-hidden text-sm" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export default function UsageTab({ usage }: Props) {
  return (
    <div className="markdown-body p-6 max-h-[640px] overflow-auto text-slate-700 dark:text-slate-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-2 text-slate-900 dark:text-slate-100">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-semibold mt-4 mb-2 text-slate-900 dark:text-slate-100">{children}</h3>,
          p: ({ children }) => <p className="my-3 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="my-3 ml-5 list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="my-3 ml-5 list-decimal space-y-1">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer noopener" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:no-underline">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-100 dark:bg-slate-800">{children}</thead>,
          th: ({ children }) => <th className="text-left font-semibold px-3 py-2 border border-slate-200 dark:border-slate-700">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 align-top">{children}</td>,
          code: ({ className, children, ...rest }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const isBlock = rest.node?.position?.start?.line !== rest.node?.position?.end?.line;
            if (match || isBlock) {
              const language = match ? match[1] : 'text';
              const value = String(children).replace(/\n$/, '');
              return <CodeBlock language={language} value={value} />;
            }
            return (
              <code className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 text-[0.85em] font-mono">
                {children}
              </code>
            );
          },
        }}
      >
        {usage}
      </ReactMarkdown>
    </div>
  );
}
