import { Disclosure } from '@headlessui/react';
import type { ReactNode } from 'react';
import { cx } from './cx';

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

/**
 * Accordion built on Headless UI's Disclosure (the same primitive Fluid UI uses) with
 * Fluid's accordion styling. Each trigger sits inside a real heading so screen reader
 * users can jump between sections.
 */
export function Accordion({
  items,
  headingLevel = 3,
  defaultOpen = [],
}: {
  items: AccordionItem[];
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  defaultOpen?: number[];
}) {
  const Heading = `h${headingLevel}` as 'h3';
  return (
    <div className="w-full divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-50 px-2 py-1 dark:divide-gray-700 dark:bg-gray-800/60">
      {items.map((item, i) => (
        <Disclosure key={item.title} as="div" defaultOpen={defaultOpen.includes(i)}>
          {({ open }) => (
            <>
              <Heading className="m-0">
                <Disclosure.Button
                  className={cx(
                    'my-1 flex w-full items-center justify-between rounded-md px-4 py-2.5 text-left text-base font-medium transition-colors',
                    'text-gray-800 hocus:bg-gray-200/50 dark:text-gray-100 dark:hocus:bg-gray-600/40',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300',
                    open && 'bg-gray-200/50 dark:bg-gray-600/40',
                  )}
                >
                  {item.title}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={cx('h-5 w-5 transition-transform motion-reduce:transition-none', open && '-rotate-180')}
                  >
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </Disclosure.Button>
              </Heading>
              <Disclosure.Panel className="mx-4 pb-3 pt-1 text-sm leading-6 text-gray-700 dark:text-gray-200">
                {item.content}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
