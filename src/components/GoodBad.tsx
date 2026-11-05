import { goodBad } from '../data/goodBad';
import { CodeBlock } from './CodeBlock';

const Cross = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0"><path fillRule="evenodd" d="M4.3 4.3a1 1 0 0 1 1.4 0L10 8.58l4.3-4.3a1 1 0 1 1 1.4 1.42L11.42 10l4.3 4.3a1 1 0 0 1-1.42 1.4L10 11.42l-4.3 4.3a1 1 0 0 1-1.4-1.42L8.58 10l-4.3-4.3a1 1 0 0 1 0-1.4Z" clipRule="evenodd" /></svg>
);
const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" /></svg>
);

/** The same thing built two ways, with what people experience in each. */
export function GoodBad({ slug }: { slug: string }) {
  const pairs = goodBad[slug];
  if (!pairs?.length) return null;
  return (
    <div className="space-y-8">
      {pairs.map((pair) => (
        <section key={pair.topic} className="space-y-3">
          <h3 className="text-lg font-semibold">{pair.topic}</h3>
          <div className="grid gap-4">
            {([
              ['bad', 'Don’t', pair.bad, 'border-red-600 dark:border-red-400', 'text-red-800 dark:text-red-200', Cross],
              ['good', 'Do', pair.good, 'border-emerald-600 dark:border-emerald-400', 'text-emerald-800 dark:text-emerald-200', Check],
            ] as const).map(([kind, label, ex, border, text, Icon]) => (
              <div key={kind} className={`surface min-w-0 border-t-4 p-4 ${border}`}>
                <h4 className={`mb-3 flex items-center gap-2 font-semibold ${text}`}>
                  <Icon />
                  {label}
                </h4>
                <CodeBlock code={ex.code} language="html" title={`${label}: ${pair.topic}`} />
                <p className="mt-3 text-sm leading-6">
                  <strong>What people experience: </strong>
                  {ex.experience}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
