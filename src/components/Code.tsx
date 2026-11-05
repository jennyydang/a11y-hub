import { Fragment } from 'react';
import { Highlight, type PrismTheme } from 'prism-react-renderer';

/**
 * Syntax colors for the dark code surface. Every color has at least 7:1
 * contrast against the background, and comments are italic so they don't
 * rely on color alone.
 */
const theme: PrismTheme = {
  plain: { color: '#f3f4f6', backgroundColor: 'transparent' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#a1a1aa', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#d4d4d8' } },
    { types: ['tag'], style: { color: '#7dd3fc' } },
    { types: ['attr-name'], style: { color: '#fcd34d' } },
    { types: ['attr-value', 'string', 'char', 'template-string'], style: { color: '#86efac' } },
    { types: ['keyword', 'selector', 'important', 'atrule'], style: { color: '#f9a8d4' } },
    { types: ['function'], style: { color: '#93c5fd' } },
    { types: ['class-name', 'maybe-class-name'], style: { color: '#c4b5fd' } },
    { types: ['number', 'boolean', 'constant', 'symbol'], style: { color: '#fdba74' } },
    { types: ['property', 'property-access'], style: { color: '#bae6fd' } },
    { types: ['operator', 'entity', 'url'], style: { color: '#e4e4e7' } },
  ],
};

const LANG: Record<string, string> = { html: 'markup', markdown: 'markdown', md: 'markdown', ts: 'tsx', tsx: 'tsx', jsx: 'jsx', js: 'javascript', css: 'css' };

/** Highlighted code tokens, rendered inside a <code>. Wrap it in your own <pre>. */
export function Code({ code, language = 'tsx' }: { code: string; language?: string }) {
  return (
    <Highlight theme={theme} code={code} language={LANG[language] ?? language}>
      {({ tokens, getTokenProps }) => (
        <code>
          {tokens.map((line, i) => (
            <Fragment key={i}>
              {i > 0 && '\n'}
              {line.map((token, k) => {
                const { key: _key, ...props } = getTokenProps({ token }) as Record<string, unknown>;
                return <span key={k} {...(props as object)} />;
              })}
            </Fragment>
          ))}
        </code>
      )}
    </Highlight>
  );
}
