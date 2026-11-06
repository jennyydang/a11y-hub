import { Checkbox } from '../../ui';
import type { Variant } from '../types';
import { checkbox } from '../components/checkbox';

export const checkboxVariants: Variant[] = [
  {
    id: 'group',
    label: 'Group with “select all”',
    description: 'The parent shows a mixed state when only some children are checked.',
    Demo: checkbox.Demo,
    html: `<fieldset>
  <legend>Pizza toppings</legend>
  <input type="checkbox" id="all"> <label for="all">All toppings</label>
  <input type="checkbox" id="mushrooms" name="topping"> <label for="mushrooms">Mushrooms</label>
  <input type="checkbox" id="olives" name="topping" checked> <label for="olives">Olives</label>
  <input type="checkbox" id="peppers" name="topping"> <label for="peppers">Peppers</label>
</fieldset>

<script>
  const all = document.getElementById('all');
  const kids = [...document.querySelectorAll('input[name="topping"]')];
  function sync() {
    const n = kids.filter((k) => k.checked).length;
    all.checked = n === kids.length;
    all.indeterminate = n > 0 && n < kids.length; // only settable from JS
  }
  all.addEventListener('change', () => { kids.forEach((k) => (k.checked = all.checked)); sync(); });
  kids.forEach((k) => k.addEventListener('change', sync));
  sync();
</script>`,
    code: checkbox.code,
  },
  {
    id: 'single',
    label: 'Single',
    description: 'One checkbox for a yes/no choice, with helper text linked through aria-describedby.',
    Demo: () => <Checkbox label="Email me about new features" description="About once a month. Unsubscribe any time." />,
    html: `<input type="checkbox" id="updates" aria-describedby="updates-desc">
<label for="updates">Email me about new features</label>
<p id="updates-desc">About once a month. Unsubscribe any time.</p>`,
    code: `<Checkbox label="Email me about new features"
  description="About once a month. Unsubscribe any time." />`,
  },
  {
    id: 'required',
    label: 'Required',
    description: 'A required consent checkbox. required is announced, and the visible label says it too.',
    Demo: () => <Checkbox label="I agree to the terms of service (required)" required />,
    html: `<input type="checkbox" id="terms" required>
<label for="terms">I agree to the terms of service (required)</label>`,
    code: `<Checkbox label="I agree to the terms of service (required)" required />`,
  },
];
