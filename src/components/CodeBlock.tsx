import { useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';

export function CodeBlock({ code, language = 'tsx', title }: { code: string; language?: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <figure className="overflow-hidden rounded-xl bg-gray-900 ring-1 ring-white/10">
      <figcaption className="flex items-center justify-between border-b border-white/10 px-4 py-1.5 text-xs text-gray-200">
        <span className="font-mono">{title ?? language}</span>
        <Button size="xs" weight="clear" color="gray" className="!text-gray-100" onClick={copy}>
          {copied ? 'Copied' : 'Copy code'}
        </Button>
      </figcaption>
      <pre className="overflow-x-auto p-4 text-[13px] leading-6 text-gray-50" tabIndex={0} aria-label={`${title ?? language} code example`}>
        <code>{code.trim()}</code>
      </pre>
      <span className="sr-only" role="status">
        {copied ? 'Code copied to clipboard' : ''}
      </span>
    </figure>
  );
}
