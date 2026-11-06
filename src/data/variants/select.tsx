import { useId } from 'react';
import type { Variant } from '../types';
import { select } from '../components/select';
import { htmlExamples } from '../html';

function NativeSelect() {
  const id = useId();
  return (
    <div className="w-full max-w-xs space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold">T-shirt size</label>
      <select
        id={id}
        defaultValue="Medium"
        className="block w-full rounded-lg bg-white px-3 py-2.5 ring-1 ring-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-800 dark:ring-gray-500 dark:focus-visible:ring-primary-300"
      >
        {['Small', 'Medium', 'Large', 'Extra large'].map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export const selectVariants: Variant[] = [
  {
    id: 'native',
    label: 'Native select',
    description: 'The most robust option: built-in keyboard support, mobile pickers and screen reader support, with no JavaScript.',
    Demo: NativeSelect,
    html: `<label for="size">T-shirt size</label>
<select id="size" name="size">
  <option>Small</option>
  <option selected>Medium</option>
  <option>Large</option>
  <option>Extra large</option>
</select>`,
    code: `<label htmlFor="size">T-shirt size</label>
<select id="size" defaultValue="Medium">
  <option>Small</option>
  <option>Medium</option>
  …
</select>`,
  },
  {
    id: 'custom',
    label: 'Custom listbox (Fluid)',
    description: 'Fluid UI’s Select: a button that opens a listbox. Use it when options need custom content like icons or descriptions.',
    Demo: select.Demo,
    html: (htmlExamples.select ?? '').split('<!-- Custom listbox')[1] ? `<!-- Custom listbox${htmlExamples.select.split('<!-- Custom listbox')[1]}` : '',
    code: select.code.split('\n\n{/*')[0],
  },
];
