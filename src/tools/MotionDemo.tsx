import { useEffect, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';

export function MotionDemo() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return (
    <div className="surface p-5">
      <h2 className="text-lg font-semibold">Your motion setting</h2>
      <p className="mt-1 text-sm">
        Your system currently reports <strong>{reduced ? 'reduce' : 'no-preference'}</strong> for prefers-reduced-motion.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <div className="flex h-16 w-48 items-center overflow-hidden rounded-lg bg-gray-50 px-2 dark:bg-gray-800" aria-hidden="true">
          <div
            className="h-10 w-10 rounded-full bg-primary-600 dark:bg-primary-300"
            style={{
              animation: playing && !reduced ? 'a11yhub-slide 1.6s ease-in-out infinite alternate' : 'none',
            }}
          />
        </div>
        <Button size="sm" weight="light" color="gray" aria-pressed={!playing} onClick={() => setPlaying((p) => !p)}>
          Pause animation
        </Button>
      </div>
      <style>{`@keyframes a11yhub-slide { from { transform: translateX(0) } to { transform: translateX(8rem) } }`}</style>
    </div>
  );
}
