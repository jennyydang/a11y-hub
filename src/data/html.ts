/**
 * Framework-free HTML for every component: semantic markup, the ARIA it needs, and the
 * smallest amount of vanilla JavaScript required for the behavior. Class names are
 * placeholders for your own styles; `.sr-only` is the usual visually-hidden utility.
 */
export const htmlExamples: Record<string, string> = {
  button: `<!-- Standard button -->
<button type="button">Save changes</button>

<!-- Submit button inside a form -->
<button type="submit">Send</button>

<!-- Toggle button: the label stays the same, aria-pressed carries the state -->
<button type="button" aria-pressed="false" id="mute">Mute notifications</button>

<!-- Icon-only button: visually hidden text gives it a name -->
<button type="button">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">…</svg>
  <span class="sr-only">Delete draft</span>
</button>

<!-- Temporarily unavailable but still discoverable -->
<button type="button" aria-disabled="true" aria-describedby="why">Publish</button>
<p id="why">Add a title before publishing.</p>

<script>
  const mute = document.getElementById('mute');
  mute.addEventListener('click', () => {
    const pressed = mute.getAttribute('aria-pressed') === 'true';
    mute.setAttribute('aria-pressed', String(!pressed));
  });
</script>`,

  menu: `<div class="menu">
  <button type="button" id="menu-btn" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-list">
    Document actions
  </button>
  <ul id="menu-list" role="menu" aria-labelledby="menu-btn" hidden>
    <li role="menuitem" tabindex="-1">Rename</li>
    <li role="menuitem" tabindex="-1">Duplicate</li>
    <li role="separator"></li>
    <li role="menuitem" tabindex="-1">Delete</li>
  </ul>
</div>

<script>
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu-list');
  const items = [...menu.querySelectorAll('[role="menuitem"]')];

  function open(index = 0) {
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    items[(index + items.length) % items.length].focus();
  }
  function close() {
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }

  btn.addEventListener('click', () => (menu.hidden ? open() : close()));
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); open(0); }
    if (e.key === 'ArrowUp') { e.preventDefault(); open(-1); }
  });
  menu.addEventListener('keydown', (e) => {
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.activeElement.click(); }
  });
  items.forEach((item) => item.addEventListener('click', () => {
    console.log('Chose', item.textContent);
    close();
  }));
</script>`,

  link: `<!-- Descriptive link text -->
<p>Read the <a href="/guidelines/color">color and contrast guidelines</a> first.</p>

<!-- Opens in a new tab: say so -->
<a href="https://www.w3.org/WAI/" target="_blank" rel="noreferrer">
  WCAG overview
  <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">…</svg>
  <span class="sr-only">(opens in a new tab)</span>
</a>

<!-- Extra details without bloating the link name -->
<a href="/q3-results.pdf" aria-describedby="q3-meta">Download Q3 results</a>
<span id="q3-meta">PDF, 2 MB</span>`,

  'site-navigation': `<nav aria-label="Main">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li>
      <button type="button" aria-expanded="false" aria-controls="nav-products">Products</button>
      <ul id="nav-products" hidden>
        <li><a href="/analytics">Analytics</a></li>
        <li><a href="/automation">Automation</a></li>
      </ul>
    </li>
    <li><a href="/pricing">Pricing</a></li>
  </ul>
</nav>

<script>
  const nav = document.querySelector('nav[aria-label="Main"]');
  const toggles = nav.querySelectorAll('button[aria-expanded]');

  function closeAll(except) {
    toggles.forEach((b) => {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      document.getElementById(b.getAttribute('aria-controls')).hidden = true;
    });
  }

  toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      closeAll(btn);
      btn.setAttribute('aria-expanded', String(!open));
      document.getElementById(btn.getAttribute('aria-controls')).hidden = open;
    });
  });

  // Escape closes and returns focus to the button
  nav.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openBtn = nav.querySelector('button[aria-expanded="true"]');
    if (openBtn) { closeAll(); openBtn.focus(); }
  });

  // Close when focus leaves the navigation
  nav.addEventListener('focusout', (e) => {
    if (!nav.contains(e.relatedTarget)) closeAll();
  });
</script>`,

  breadcrumbs: `<nav aria-label="Breadcrumb">
  <ol class="breadcrumbs">
    <li><a href="/">Home</a></li>
    <li><a href="/components">Components</a></li>
    <li><a href="/components/breadcrumbs" aria-current="page">Breadcrumbs</a></li>
  </ol>
</nav>

<style>
  .breadcrumbs { display: flex; flex-wrap: wrap; list-style: none; padding: 0; }
  /* Separators drawn in CSS are not read by screen readers */
  .breadcrumbs li + li::before { content: "/"; margin: 0 0.5em; }
</style>`,

  pagination: `<p aria-live="polite">Showing results 21–30 of 80</p>

<nav aria-label="Search results pages">
  <ul class="pagination">
    <li><a href="?page=2">Previous<span class="sr-only"> page</span></a></li>
    <li><a href="?page=1"><span class="sr-only">Page </span>1</a></li>
    <li aria-hidden="true">…</li>
    <li><a href="?page=3" aria-current="page"><span class="sr-only">Page </span>3</a></li>
    <li><a href="?page=4"><span class="sr-only">Page </span>4</a></li>
    <li><a href="?page=8"><span class="sr-only">Page </span>8</a></li>
    <li><a href="?page=4">Next<span class="sr-only"> page</span></a></li>
  </ul>
</nav>`,

  'skip-link': `<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header>…site navigation…</header>
  <main id="main" tabindex="-1">…</main>
</body>

<style>
  .skip-link {
    position: absolute;
    left: 1rem;
    top: 1rem;
    transform: translateY(-200%);
  }
  .skip-link:focus { transform: none; }
  main:focus { outline: none; }
</style>`,

  tabs: `<div class="tabs">
  <div role="tablist" aria-label="Product details">
    <button type="button" role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1">Overview</button>
    <button type="button" role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2" tabindex="-1">Specs</button>
    <button type="button" role="tab" id="tab-3" aria-selected="false" aria-controls="panel-3" tabindex="-1">Reviews</button>
  </div>
  <div role="tabpanel" id="panel-1" aria-labelledby="tab-1" tabindex="0">…</div>
  <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" tabindex="0" hidden>…</div>
  <div role="tabpanel" id="panel-3" aria-labelledby="tab-3" tabindex="0" hidden>…</div>
</div>

<script>
  const tabs = [...document.querySelectorAll('[role="tab"]')];

  function select(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    tab.focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length]);
    });
  });
</script>`,

  accordion: `<div class="accordion">
  <h3>
    <button type="button" aria-expanded="true" aria-controls="faq-1">What is your return policy?</button>
  </h3>
  <div id="faq-1">Return unused items within 30 days for a full refund.</div>

  <h3>
    <button type="button" aria-expanded="false" aria-controls="faq-2">Do you ship internationally?</button>
  </h3>
  <div id="faq-2" hidden>Yes, to over 40 countries.</div>
</div>

<script>
  document.querySelectorAll('.accordion button[aria-expanded]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      document.getElementById(btn.getAttribute('aria-controls')).hidden = open;
    });
  });
</script>

<!-- No JavaScript at all: <details> works too, but can't sit inside a heading -->
<details>
  <summary>What is your return policy?</summary>
  <p>Return unused items within 30 days.</p>
</details>`,

  'text-input': `<form novalidate>
  <label for="email">Email address <span aria-hidden="true">*</span></label>
  <p id="email-hint">We'll only use this to send your receipt.</p>
  <input id="email" name="email" type="email" autocomplete="email" required
         aria-describedby="email-hint">
  <p id="email-error" class="error" hidden></p>
  <button type="submit">Send receipt</button>
</form>

<script>
  const form = document.querySelector('form');
  const input = document.getElementById('email');
  const error = document.getElementById('email-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.validity.valid) {
      input.removeAttribute('aria-invalid');
      input.setAttribute('aria-describedby', 'email-hint');
      error.hidden = true;
      return;
    }
    error.textContent = input.value
      ? 'Error: Enter an email address in the format name@example.com.'
      : 'Error: Enter your email address.';
    error.hidden = false;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', 'email-hint email-error');
    input.focus();
  });
</script>`,

  textarea: `<label for="notes">Delivery instructions</label>
<p id="notes-hint">For example, gate code. Up to 200 characters.</p>
<textarea id="notes" rows="4" aria-describedby="notes-hint notes-count"></textarea>
<p id="notes-count">200 characters remaining</p>

<!-- Separate, debounced announcement so screen readers aren't flooded -->
<p id="notes-live" class="sr-only" aria-live="polite"></p>

<script>
  const MAX = 200;
  const area = document.getElementById('notes');
  const count = document.getElementById('notes-count');
  const live = document.getElementById('notes-live');
  let timer;

  area.addEventListener('input', () => {
    const left = MAX - area.value.length;
    const msg = left >= 0 ? left + ' characters remaining' : -left + ' characters too many';
    count.textContent = msg;
    area.toggleAttribute('aria-invalid', left < 0);
    clearTimeout(timer);
    timer = setTimeout(() => (live.textContent = msg), 800);
  });
</script>`,

  checkbox: `<fieldset>
  <legend>Pizza toppings</legend>

  <input type="checkbox" id="all">
  <label for="all">All toppings</label>

  <div class="children">
    <input type="checkbox" id="mushrooms" name="topping" value="mushrooms">
    <label for="mushrooms">Mushrooms</label>
    <input type="checkbox" id="olives" name="topping" value="olives" checked>
    <label for="olives">Olives</label>
    <input type="checkbox" id="peppers" name="topping" value="peppers">
    <label for="peppers">Peppers</label>
  </div>
</fieldset>

<input type="checkbox" id="terms" aria-describedby="terms-desc">
<label for="terms">Accept the terms</label>
<p id="terms-desc">You can withdraw consent at any time.</p>

<script>
  // "Mixed" state can only be set from JavaScript
  const all = document.getElementById('all');
  const kids = [...document.querySelectorAll('input[name="topping"]')];
  function sync() {
    const n = kids.filter((k) => k.checked).length;
    all.checked = n === kids.length;
    all.indeterminate = n > 0 && n < kids.length;
  }
  all.addEventListener('change', () => { kids.forEach((k) => (k.checked = all.checked)); sync(); });
  kids.forEach((k) => k.addEventListener('change', sync));
  sync();
</script>`,

  'radio-group': `<fieldset aria-describedby="speed-hint">
  <legend>Delivery speed</legend>
  <p id="speed-hint">Prices include tax.</p>

  <div>
    <input type="radio" id="standard" name="speed" value="standard" checked aria-describedby="standard-desc">
    <label for="standard">Standard</label>
    <span id="standard-desc">4–6 business days, free</span>
  </div>
  <div>
    <input type="radio" id="express" name="speed" value="express" aria-describedby="express-desc">
    <label for="express">Express</label>
    <span id="express-desc">1–2 business days, $9</span>
  </div>
  <div>
    <input type="radio" id="drone" name="speed" value="drone" disabled aria-describedby="drone-desc">
    <label for="drone">Same-day drone</label>
    <span id="drone-desc">Not available in your area</span>
  </div>
</fieldset>
<!-- No JavaScript needed: the shared name gives arrow-key navigation -->`,

  switch: `<!-- Option 1: native checkbox with switch semantics (no JS needed) -->
<input type="checkbox" role="switch" id="wifi" checked>
<label for="wifi">Wi-Fi</label>

<!-- Option 2: button-based switch -->
<span id="airplane-label">Airplane mode</span>
<button type="button" role="switch" aria-checked="false" aria-labelledby="airplane-label" id="airplane">
  <span class="thumb" aria-hidden="true"></span>
</button>

<script>
  const sw = document.getElementById('airplane');
  sw.addEventListener('click', () => {
    sw.setAttribute('aria-checked', String(sw.getAttribute('aria-checked') !== 'true'));
  });
</script>`,

  select: `<!-- Recommended: a native select. No JavaScript needed. -->
<label for="size">T-shirt size</label>
<select id="size" name="size">
  <option>Small</option>
  <option selected>Medium</option>
  <option>Large</option>
  <option>Extra large</option>
</select>

<!-- Custom listbox: only when you need custom option content.
     Needs JS for open/close, arrow keys, typeahead and Escape. -->
<span id="size-label">T-shirt size</span>
<button type="button" id="size-btn" aria-haspopup="listbox" aria-expanded="false"
        aria-labelledby="size-label size-btn">Medium</button>
<ul role="listbox" id="size-list" aria-labelledby="size-label" tabindex="-1"
    aria-activedescendant="opt-medium" hidden>
  <li role="option" id="opt-small" aria-selected="false">Small</li>
  <li role="option" id="opt-medium" aria-selected="true">Medium</li>
  <li role="option" id="opt-large" aria-selected="false">Large</li>
</ul>`,

  combobox: `<label for="country">Country</label>
<div class="combobox">
  <input id="country" type="text" role="combobox" autocomplete="off"
         aria-autocomplete="list" aria-expanded="false" aria-controls="country-list">
  <ul id="country-list" role="listbox" aria-label="Countries" hidden></ul>
</div>
<p id="country-status" class="sr-only" role="status"></p>

<script>
  const countries = ['Argentina', 'Australia', 'Brazil', 'Canada', 'Chile', 'Denmark', 'France'];
  const input = document.getElementById('country');
  const list = document.getElementById('country-list');
  const status = document.getElementById('country-status');
  let active = -1;

  function render() {
    const q = input.value.toLowerCase();
    const matches = countries.filter((c) => c.toLowerCase().startsWith(q));
    list.innerHTML = matches
      .map((c, i) => '<li role="option" id="opt-' + i + '" aria-selected="false">' + c + '</li>')
      .join('');
    list.hidden = !q || matches.length === 0;
    input.setAttribute('aria-expanded', String(!list.hidden));
    status.textContent = q ? matches.length + ' results available' : '';
    active = -1;
    input.removeAttribute('aria-activedescendant');
  }

  function move(delta) {
    const opts = [...list.children];
    if (!opts.length) return;
    active = (active + delta + opts.length) % opts.length;
    opts.forEach((o, i) => o.setAttribute('aria-selected', String(i === active)));
    input.setAttribute('aria-activedescendant', opts[active].id);
    opts[active].scrollIntoView({ block: 'nearest' });
  }

  function choose(opt) {
    input.value = opt.textContent;
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) render(); move(1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    if (e.key === 'Enter' && active >= 0) { e.preventDefault(); choose(list.children[active]); }
    if (e.key === 'Escape') { list.hidden = true; input.setAttribute('aria-expanded', 'false'); }
  });
  list.addEventListener('click', (e) => e.target.matches('[role="option"]') && choose(e.target));
</script>`,

  slider: `<label for="temp">Thermostat</label>
<output for="temp" id="temp-out">21°C</output>
<input id="temp" type="range" min="16" max="28" step="0.5" value="21"
       aria-valuetext="21 degrees Celsius, comfortable">

<script>
  const temp = document.getElementById('temp');
  const out = document.getElementById('temp-out');
  temp.addEventListener('input', () => {
    const v = Number(temp.value);
    const feel = v < 19 ? 'cool' : v > 23 ? 'warm' : 'comfortable';
    out.textContent = v + '°C';
    temp.setAttribute('aria-valuetext', v + ' degrees Celsius, ' + feel);
  });
</script>`,

  'date-picker': `<!-- Native date input: keyboard entry, localized format and a built-in calendar -->
<label for="checkin">Check-in date</label>
<p id="checkin-hint">Pick today or a later date.</p>
<input id="checkin" type="date" min="2026-11-04" aria-describedby="checkin-hint">
<p id="checkin-confirm" aria-live="polite"></p>

<script>
  const date = document.getElementById('checkin');
  const confirm = document.getElementById('checkin-confirm');
  date.addEventListener('change', () => {
    if (!date.value) return (confirm.textContent = '');
    const d = new Date(date.value + 'T00:00:00');
    confirm.textContent = 'You picked ' + d.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }) + '.';
  });
</script>

<!-- Memorable dates (like a birthday): separate fields are faster -->
<fieldset>
  <legend>Date of birth</legend>
  <p id="dob-hint">For example, 27 3 1990</p>
  <label for="dob-day">Day</label>
  <input id="dob-day" inputmode="numeric" autocomplete="bday-day" size="2" aria-describedby="dob-hint">
  <label for="dob-month">Month</label>
  <input id="dob-month" inputmode="numeric" autocomplete="bday-month" size="2">
  <label for="dob-year">Year</label>
  <input id="dob-year" inputmode="numeric" autocomplete="bday-year" size="4">
</fieldset>`,

  'file-upload': `<div class="dropzone">
  <label for="files">Attachments</label>
  <p id="files-hint">PDF or image, up to 5 MB each. Drag files here or choose them.</p>
  <input id="files" type="file" multiple accept=".pdf,image/*" aria-describedby="files-hint">
</div>
<p id="files-error" role="alert"></p>
<ul id="file-list" aria-label="Selected files"></ul>
<p id="files-status" class="sr-only" role="status"></p>

<script>
  const MAX = 5 * 1024 * 1024;
  const input = document.getElementById('files');
  const list = document.getElementById('file-list');
  const status = document.getElementById('files-status');
  const error = document.getElementById('files-error');
  const zone = document.querySelector('.dropzone');

  function add(files) {
    const rejected = [];
    [...files].forEach((f) => {
      if (f.size > MAX) return rejected.push(f.name);
      const li = document.createElement('li');
      li.textContent = f.name + ' ';
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove ' + f.name);
      remove.addEventListener('click', () => {
        li.remove();
        status.textContent = f.name + ' removed.';
        input.focus(); // never leave focus on a removed button
      });
      li.append(remove);
      list.append(li);
    });
    error.textContent = rejected.length ? 'Error: ' + rejected.join(', ') + ' is larger than 5 MB.' : '';
    const added = files.length - rejected.length;
    if (added) status.textContent = added + (added > 1 ? ' files' : ' file') + ' added.';
  }

  input.addEventListener('change', () => { add(input.files); input.value = ''; });
  zone.addEventListener('dragover', (e) => e.preventDefault());
  zone.addEventListener('drop', (e) => { e.preventDefault(); add(e.dataTransfer.files); });
</script>`,

  'error-summary': `<form novalidate id="details">
  <div id="error-summary" tabindex="-1" role="alert" aria-labelledby="summary-title" hidden>
    <h2 id="summary-title">There is a problem</h2>
    <ul></ul>
  </div>

  <label for="name">Full name</label>
  <input id="name" autocomplete="name" required>
  <p id="name-error" class="error" hidden></p>

  <label for="email">Email address</label>
  <input id="email" type="email" autocomplete="email" required>
  <p id="email-error" class="error" hidden></p>

  <button type="submit">Continue</button>
</form>

<script>
  const form = document.getElementById('details');
  const summary = document.getElementById('error-summary');
  const messages = {
    name: 'Enter your full name.',
    email: 'Enter an email address in the format name@example.com.',
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid = ['name', 'email'].filter((id) => !document.getElementById(id).checkValidity());

    ['name', 'email'].forEach((id) => {
      const input = document.getElementById(id);
      const err = document.getElementById(id + '-error');
      const bad = invalid.includes(id);
      err.hidden = !bad;
      err.textContent = bad ? 'Error: ' + messages[id] : '';
      input.toggleAttribute('aria-invalid', bad);
      if (bad) input.setAttribute('aria-describedby', id + '-error');
      else input.removeAttribute('aria-describedby');
    });

    if (!invalid.length) { summary.hidden = true; return; }
    summary.querySelector('h2').textContent =
      invalid.length === 1 ? 'There is a problem' : 'There are ' + invalid.length + ' problems';
    summary.querySelector('ul').innerHTML = invalid
      .map((id) => '<li><a href="#' + id + '">' + messages[id] + '</a></li>')
      .join('');
    summary.hidden = false;
    summary.focus();
    document.title = 'Error: ' + document.title.replace(/^Error: /, '');
  });

  // Make each link move focus into its field, not just scroll
  summary.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).focus();
  });
</script>`,

  dialog: `<button type="button" id="open-delete">Delete report…</button>

<!-- Native <dialog> + showModal() gives focus containment, Escape and an inert background -->
<dialog id="confirm-delete" aria-labelledby="dlg-title" aria-describedby="dlg-desc">
  <h2 id="dlg-title">Delete “Q3 report”?</h2>
  <p id="dlg-desc">This permanently removes the file and its version history. You can't undo this.</p>
  <form method="dialog">
    <button value="cancel" autofocus>Cancel</button>
    <button value="delete">Delete file</button>
  </form>
</dialog>

<script>
  const opener = document.getElementById('open-delete');
  const dialog = document.getElementById('confirm-delete');

  opener.addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'delete') console.log('Deleted');
    opener.focus(); // return focus to the trigger
  });
</script>`,

  tooltip: `<!-- Tooltip as the name of an icon-only button -->
<span class="tooltip-wrap">
  <button type="button" aria-labelledby="tip-copy">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">…</svg>
  </button>
  <span role="tooltip" id="tip-copy" class="tooltip">Copy link</span>
</span>

<!-- Tooltip as extra description -->
<span class="tooltip-wrap">
  <button type="button" aria-describedby="tip-draft">Save draft</button>
  <span role="tooltip" id="tip-draft" class="tooltip">Drafts are deleted after 30 days</span>
</span>

<style>
  .tooltip-wrap { position: relative; display: inline-flex; }
  .tooltip { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
             visibility: hidden; opacity: 0; }
  .tooltip.is-open { visibility: visible; opacity: 1; }
</style>

<script>
  document.querySelectorAll('.tooltip-wrap').forEach((wrap) => {
    const tip = wrap.querySelector('[role="tooltip"]');
    const trigger = wrap.querySelector('button');
    let hideTimer;
    const show = () => { clearTimeout(hideTimer); tip.classList.add('is-open'); };
    const hide = () => { hideTimer = setTimeout(() => tip.classList.remove('is-open'), 120); };

    trigger.addEventListener('focus', show);
    trigger.addEventListener('blur', hide);
    wrap.addEventListener('pointerenter', show);   // includes hovering the tooltip itself
    wrap.addEventListener('pointerleave', hide);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') tip.classList.remove('is-open');
    });
  });
</script>`,

  toast: `<!-- Render these regions once, empty, when the page loads -->
<div id="toast-polite" class="toasts" role="status" aria-live="polite" aria-atomic="true"></div>
<div id="toast-assertive" class="toasts" role="alert" aria-atomic="true"></div>

<button type="button" id="save">Save profile</button>

<script>
  function toast(message, { error = false, duration = 6000 } = {}) {
    const region = document.getElementById(error ? 'toast-assertive' : 'toast-polite');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;

    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.textContent = 'Dismiss';
    dismiss.addEventListener('click', () => el.remove());
    el.append(' ', dismiss);
    region.append(el);

    if (error) return; // errors stay until dismissed
    let timer = setTimeout(() => el.remove(), duration);
    // Pause while hovered or focused
    el.addEventListener('pointerenter', () => clearTimeout(timer));
    el.addEventListener('focusin', () => clearTimeout(timer));
    el.addEventListener('pointerleave', () => (timer = setTimeout(() => el.remove(), duration)));
  }

  document.getElementById('save').addEventListener('click', () => toast('Changes saved.'));
</script>`,

  alert: `<!-- Static: present on page load. No role needed. -->
<div class="alert alert-warning">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">…</svg>
  <p><strong><span class="sr-only">Warning: </span>Scheduled maintenance</strong></p>
  <p>The dashboard will be read-only on Sunday from 02:00 to 04:00 UTC.</p>
</div>

<!-- Dynamic: an empty alert region that exists before the message is added -->
<div id="payment-error" role="alert"></div>

<script>
  function showPaymentError() {
    document.getElementById('payment-error').innerHTML =
      '<p><strong>Error: Payment declined.</strong> Try a different card or contact your bank.</p>';
  }
</script>`,

  progress: `<!-- Determinate: native <progress> -->
<label for="upload">Uploading vacation.zip</label>
<progress id="upload" max="100" value="60">60%</progress>

<!-- Or a custom bar -->
<span id="upload-label">Uploading vacation.zip</span>
<div role="progressbar" aria-labelledby="upload-label"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="60">
  <div class="bar" style="width: 60%"></div>
</div>

<!-- Announce start and finish, not every step -->
<p id="upload-status" role="status"></p>

<!-- Spinner: visible text, decorative animation -->
<p role="status">
  <svg class="spin" aria-hidden="true" focusable="false" viewBox="0 0 24 24">…</svg>
  Loading comments…
</p>

<style>
  @media (prefers-reduced-motion: reduce) { .spin { animation: none; } }
</style>

<script>
  // When the upload finishes
  document.getElementById('upload-status').textContent = 'Upload complete.';
</script>`,

  skeleton: `<button type="button" id="load">Load files</button>

<!-- In the page from the start, so changes to it are announced -->
<p role="status" class="sr-only" id="load-status"></p>

<ul aria-label="Recent files" id="files" aria-busy="false"></ul>

<style>
  .skeleton { background: #e5e7eb; border-radius: 4px; }
  @media (prefers-reduced-motion: no-preference) {
    .skeleton { animation: pulse 2s ease-in-out infinite; }
  }
  @keyframes pulse { 50% { opacity: .5; } }
</style>

<script>
  const list = document.getElementById('files');
  const status = document.getElementById('load-status');
  document.getElementById('load').addEventListener('click', async () => {
    list.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading files';
    // Placeholder shapes are hidden from assistive tech
    list.innerHTML = '<li aria-hidden="true"><span class="skeleton"></span></li>'.repeat(3);
    const files = await fetch('/api/files').then((r) => r.json());
    list.innerHTML = files.map((f) => \`<li>\${f.title}</li>\`).join('');
    list.setAttribute('aria-busy', 'false');
    status.textContent = \`\${files.length} files loaded\`;
  });
</script>`,
  image: `<!-- Informative image -->
<img src="team.jpg" alt="Our five-person support team at the Lisbon office">

<!-- Decorative image -->
<img src="divider.svg" alt="">

<!-- Image link: describe the destination, not the picture -->
<a href="/"><img src="logo.svg" alt="Acme home"></a>

<!-- Chart with a caption and text alternative -->
<figure>
  <svg role="img" aria-labelledby="chart-title chart-desc" viewBox="0 0 200 110">
    <title id="chart-title">Monthly signups</title>
    <desc id="chart-desc">Signups rose from 120 in January to 310 in April.</desc>
    …
  </svg>
  <figcaption>Monthly signups, January to April</figcaption>
</figure>

<!-- Decorative icon next to text -->
<span><svg aria-hidden="true" focusable="false">…</svg> Favorite projects</span>`,

  table: `<table>
  <caption>Team members</caption>
  <thead>
    <tr>
      <th scope="col" aria-sort="ascending"><button type="button">Name</button></th>
      <th scope="col"><button type="button">Role</button></th>
      <th scope="col"><button type="button">Start date</button></th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">Ada Lovelace</th><td>Engineer</td><td>2021-03-01</td></tr>
    <tr><th scope="row">Alan Turing</th><td>Researcher</td><td>2020-11-30</td></tr>
    <tr><th scope="row">Grace Hopper</th><td>Admiral</td><td>2019-07-15</td></tr>
  </tbody>
</table>

<script>
  const table = document.querySelector('table');
  const headers = [...table.querySelectorAll('thead th')];

  headers.forEach((th, col) => {
    th.querySelector('button').addEventListener('click', () => {
      const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
      headers.forEach((h) => h.removeAttribute('aria-sort'));
      th.setAttribute('aria-sort', dir);

      const body = table.tBodies[0];
      const rows = [...body.rows].sort((a, b) => {
        const r = a.cells[col].textContent.localeCompare(b.cells[col].textContent);
        return dir === 'ascending' ? r : -r;
      });
      body.append(...rows);
    });
  });
</script>`,
};
