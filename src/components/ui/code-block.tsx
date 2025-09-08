'use client';

import { useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface CodeBlockProps {
  language?: string;
  children: string;
}

const highlightCode = (code: string) => {
  return code
    .replace(/\b(java)\b/g, `<span class="text-green-400 font-medium">$1</span>`)
    .replace(/(-D[\w.]+=[^\s]+)/g, `<span class="text-blue-400">$1</span>`)
    .replace(/\b(-jar)\b/g, `<span class="text-purple-400">$1</span>`)
    .replace(/([\w.-]+\.jar)/g, `<span class="text-pink-400">$1</span>`);
};

export function CodeBlock({ language = 'bash', children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const cleaned = children.replace(/^\$\s?/gm, '');
    navigator.clipboard.writeText(cleaned);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative w-full bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b border-neutral-700">
        <span className="text-xs font-mono text-neutral-400">{language.toUpperCase()}</span>
        <Button
          onClick={handleCopy}
          size="sm"
          variant="ghost"
          className="text-neutral-400 hover:text-white"
        >
          <Copy className="size-4 mr-1" />
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>

      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-neutral-200">
        <code
          className="whitespace-pre"
          dangerouslySetInnerHTML={{
            __html: children
              ? highlightCode(children)
              .replace(/^\$/gm, `<span class="text-neutral-500 select-none">$</span>`)
              : '',
          }}
        />
      </pre>
    </div>
  );
}
