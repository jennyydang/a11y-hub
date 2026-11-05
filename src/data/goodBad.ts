/**
 * Good and bad examples for every component: the same thing built two ways, with what
 * people actually experience. Code is plain HTML so every role can read it.
 */

export interface Example {
  code: string;
  /** What people experience with this version: screen reader output, keyboard, visual. */
  experience: string;
}

export interface Pair {
  /** What this pair is about, as a short heading. */
  topic: string;
  bad: Example;
  good: Example;
}

export const goodBad: Record<string, Pair[]> = {
  header: [
    {
      topic: 'Use a real header and a named nav',
      bad: { code: `<div class="top">\n  <img src="logo.png">\n  <div class="links">\n    <a href="/trails">Trails</a>\n  </div>\n</div>`, experience: 'No banner landmark, no navigation landmark, and the logo link has no name.' },
      good: { code: `<header>\n  <a href="/"><img src="logo.png" alt="Trailmate home"></a>\n  <nav aria-label="Main">\n    <ul><li><a href="/trails">Trails</a></li></ul>\n  </nav>\n</header>`, experience: '“Banner landmark. Trailmate home, link. Main navigation.” People can jump to or past it.' },
    },
    {
      topic: 'Don’t let a sticky header hide focus',
      bad: { code: `<header style="position:sticky;top:0;height:40vh">…</header>`, experience: 'As keyboard users tab down, the focused link slides under the header and disappears.' },
      good: { code: `<header class="sticky top-0">…</header>\n<style>\n  html { scroll-padding-top: 5rem; }\n</style>`, experience: 'The header stays short, and scroll padding keeps the focused item in view below it.' },
    },
  ],
  footer: [
    {
      topic: 'Use a footer with readable, grouped links',
      bad: { code: `<div class="bottom" style="font-size:11px;color:#9ca3af">\n  <a href="/contact">Contact</a> | <a href="/privacy">Privacy</a>\n</div>`, experience: 'Tiny gray text fails contrast, the pipes are read aloud, and there’s no landmark.' },
      good: { code: `<footer>\n  <nav aria-label="Footer">\n    <h2 id="help">Help</h2>\n    <ul aria-labelledby="help">\n      <li><a href="/contact">Contact us</a></li>\n      <li><a href="/privacy">Privacy</a></li>\n    </ul>\n  </nav>\n</footer>`, experience: '“Content information landmark. Footer navigation. Help, heading level 2. List, 2 items.”' },
    },
  ],
  fieldset: [
    {
      topic: 'Use a legend, not a heading above the fields',
      bad: { code: `<h2>Date of birth</h2>\n<label for="d">Day</label><input id="d">\n<label for="m">Month</label><input id="m">`, experience: 'Tabbing into “Day” says “Day, edit text”: day of what? The heading isn’t read.' },
      good: { code: `<fieldset>\n  <legend>Date of birth</legend>\n  <label for="d">Day</label><input id="d">\n  <label for="m">Month</label><input id="m">\n</fieldset>`, experience: '“Date of birth, group. Day, edit text.”' },
    },
  ],
  'star-rating': [
    {
      topic: 'Build stars from radios',
      bad: { code: `<div class="stars">\n  <span onclick="rate(1)">★</span><span onclick="rate(2)">★</span>…\n</div>`, experience: 'Not focusable. Screen readers hear “black star, black star, black star”.' },
      good: { code: `<fieldset>\n  <legend>Rate Riverside loop</legend>\n  <label><input type="radio" name="r" value="1" class="sr-only">\n    <svg aria-hidden="true">…</svg><span class="sr-only">1 star</span></label>\n  …\n</fieldset>`, experience: '“Rate Riverside loop, group. 1 star, radio button, 1 of 5.” Arrow keys change the score.' },
    },
  ],
  button: [
    {
      topic: 'Use a real button',
      bad: { code: `<div class="btn" onclick="save()">Save changes</div>`, experience: 'Can’t be reached with Tab or activated with Enter or Space. Screen readers say only “Save changes”, with no role.' },
      good: { code: `<button type="button">Save changes</button>`, experience: 'Focusable, works with Enter and Space, and is announced as “Save changes, button”.' },
    },
    {
      topic: 'Name icon-only buttons',
      bad: { code: `<button type="button">\n  <svg viewBox="0 0 20 20" width="20"><path d="M4 6h12l-1 11H5L4 6Zm3-3h6v2H7V3Z"/></svg>\n</button>`, experience: 'Announced as just “button”. Nobody using a screen reader or voice control knows what it does.' },
      good: { code: `<button type="button">\n  <svg aria-hidden="true" viewBox="0 0 20 20" width="20"><path d="M4 6h12l-1 11H5L4 6Zm3-3h6v2H7V3Z"/></svg>\n  <span class="sr-only">Delete draft</span>\n</button>`, experience: 'Announced as “Delete draft, button”, and voice users can say “click Delete draft”.' },
    },
  ],
  menu: [
    {
      topic: 'Say that the button opens a menu',
      bad: { code: `<button type="button">Actions</button>\n<ul class="menu" hidden>…</ul>`, experience: 'Nothing says a menu opens or whether it’s open. Focus doesn’t move into it.' },
      good: { code: `<button type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="actions">Actions</button>\n<ul id="actions" role="menu" hidden>\n  <li role="menuitem" tabindex="-1">Rename</li>\n</ul>`, experience: '“Actions, menu button, collapsed.” On open, focus moves to the first item and arrow keys move through it.' },
    },
  ],
  link: [
    {
      topic: 'Write link text that makes sense alone',
      bad: { code: `<p>To read our 2026 accessibility report, <a href="/report">click here</a>.</p>`, experience: 'In a screen reader’s links list, it’s one of many “click here” links with no destination.' },
      good: { code: `<p>Read our <a href="/report">2026 accessibility report</a>.</p>`, experience: 'The links list shows “2026 accessibility report”. Voice users can say the link’s name.' },
    },
  ],
  'site-navigation': [
    {
      topic: 'Use a labelled nav and mark the current page',
      bad: { code: `<div class="nav">\n  <a href="/">Home</a>\n  <a href="/trails" class="active">Trails</a>\n</div>`, experience: 'Not a landmark, so people can’t jump to it. The current page is shown only by color.' },
      good: { code: `<nav aria-label="Main">\n  <ul>\n    <li><a href="/">Home</a></li>\n    <li><a href="/trails" aria-current="page">Trails</a></li>\n  </ul>\n</nav>`, experience: '“Main navigation, list, 2 items. Trails, current page, link.”' },
    },
  ],
  breadcrumbs: [
    {
      topic: 'Use a list in a labelled nav',
      bad: { code: `<div>Home > Trails > Riverside loop</div>`, experience: 'Read as one sentence, “Home greater than Trails…”. Nothing is a link.' },
      good: { code: `<nav aria-label="Breadcrumb">\n  <ol>\n    <li><a href="/">Home</a></li>\n    <li><a href="/trails">Trails</a></li>\n    <li aria-current="page">Riverside loop</li>\n  </ol>\n</nav>`, experience: '“Breadcrumb navigation, list, 3 items.” Separators are drawn with CSS, so they aren’t read.' },
    },
  ],
  pagination: [
    {
      topic: 'Give page links clear names',
      bad: { code: `<div class="pages">\n  <a href="?p=1">1</a> <a href="?p=2">2</a> <a href="?p=3">›</a>\n</div>`, experience: 'Heard as “1, link”, “2, link”, “single right-pointing angle, link”. No current page.' },
      good: { code: `<nav aria-label="Pagination">\n  <ul>\n    <li><a href="?p=1" aria-current="page"><span class="sr-only">Page </span>1</a></li>\n    <li><a href="?p=2"><span class="sr-only">Page </span>2</a></li>\n    <li><a href="?p=2">Next<span class="sr-only"> page</span></a></li>\n  </ul>\n</nav>`, experience: '“Page 1, current page, link. Page 2, link. Next page, link.”' },
    },
  ],
  'skip-link': [
    {
      topic: 'Make it the first thing, and visible on focus',
      bad: { code: `<header>…logo, 20 links…</header>\n<a href="#main" style="display:none">Skip to content</a>`, experience: 'display:none removes it completely, and it comes after the header it should skip.' },
      good: { code: `<a href="#main" class="skip-link">Skip to main content</a>\n<header>…</header>\n<main id="main" tabindex="-1">…</main>`, experience: 'The first Tab shows “Skip to main content”. Enter jumps past the header.' },
    },
  ],
  tabs: [
    {
      topic: 'Use tab roles, not just styled buttons',
      bad: { code: `<div class="tabs">\n  <button class="active">Profile</button>\n  <button>Security</button>\n</div>`, experience: 'Two separate buttons. Nothing says which one is selected or that they control a panel.' },
      good: { code: `<div role="tablist" aria-label="Account">\n  <button role="tab" aria-selected="true" aria-controls="p1" id="t1">Profile</button>\n  <button role="tab" aria-selected="false" aria-controls="p2" id="t2" tabindex="-1">Security</button>\n</div>\n<div role="tabpanel" id="p1" aria-labelledby="t1">…</div>`, experience: '“Profile, tab, selected, 1 of 2.” Arrow keys switch tabs; Tab goes into the panel.' },
    },
  ],
  accordion: [
    {
      topic: 'Use a button inside a heading',
      bad: { code: `<h3 onclick="toggle()">Can I bring my dog?</h3>\n<div hidden>Yes, on a lead.</div>`, experience: 'A heading isn’t focusable or operable by keyboard, and nothing says it expands.' },
      good: { code: `<h3>\n  <button type="button" aria-expanded="false" aria-controls="a1">Can I bring my dog?</button>\n</h3>\n<div id="a1" hidden>Yes, on a lead.</div>`, experience: '“Can I bring my dog?, button, collapsed, heading level 3.” Enter opens it.' },
    },
  ],
  'text-input': [
    {
      topic: 'Use a visible label, not a placeholder',
      bad: { code: `<input type="email" placeholder="Email">`, experience: 'The hint vanishes as soon as people type. Some screen readers don’t read placeholders, and low-contrast placeholder text is hard to see.' },
      good: { code: `<label for="email">Email address</label>\n<input id="email" type="email" autocomplete="email">`, experience: '“Email address, edit text.” The label stays visible, and the browser can autofill it.' },
    },
  ],
  textarea: [
    {
      topic: 'State limits before people type',
      bad: { code: `<label for="c">Comments</label>\n<textarea id="c" maxlength="200"></textarea>`, experience: 'Text stops appearing at 200 characters with no warning; pasted text gets cut silently.' },
      good: { code: `<label for="c">Comments</label>\n<p id="c-hint">You can enter up to 200 characters.</p>\n<textarea id="c" aria-describedby="c-hint"></textarea>`, experience: 'The limit is read on focus. People can type past it and edit down.' },
    },
  ],
  checkbox: [
    {
      topic: 'Use a native checkbox with a label',
      bad: { code: `<span class="box" onclick="this.classList.toggle('on')"></span> Subscribe`, experience: 'No role, no state, not focusable. Clicking the word “Subscribe” does nothing.' },
      good: { code: `<input type="checkbox" id="sub">\n<label for="sub">Email me new trail guides</label>`, experience: '“Email me new trail guides, checkbox, not checked.” Clicking the label toggles it too.' },
    },
  ],
  'radio-group': [
    {
      topic: 'Group radios with a legend',
      bad: { code: `<p>Plan</p>\n<input type="radio" name="plan" id="f"><label for="f">Free</label>\n<input type="radio" name="plan" id="p"><label for="p">Plus</label>`, experience: 'Screen readers hear “Free, radio button” without the question “Plan”.' },
      good: { code: `<fieldset>\n  <legend>Plan</legend>\n  <input type="radio" name="plan" id="f"><label for="f">Free</label>\n  <input type="radio" name="plan" id="p"><label for="p">Plus</label>\n</fieldset>`, experience: '“Plan, group. Free, radio button, not checked, 1 of 2.”' },
    },
  ],
  switch: [
    {
      topic: 'Expose the on/off state',
      bad: { code: `<button type="button" class="switch on">Notifications</button>`, experience: 'Heard as a plain button. Whether it’s on is shown only by color and position.' },
      good: { code: `<button type="button" role="switch" aria-checked="true">Notifications</button>`, experience: '“Notifications, switch, on.” Pressing it announces “off”.' },
    },
  ],
  select: [
    {
      topic: 'Prefer the native select',
      bad: { code: `<div class="dropdown" onclick="open()">Choose a country ▾</div>`, experience: 'Not focusable, no role, no keyboard support. Mobile users don’t get the native picker.' },
      good: { code: `<label for="country">Country</label>\n<select id="country" autocomplete="country-name">\n  <option>Portugal</option>\n  <option>Spain</option>\n</select>`, experience: '“Country, combo box, Portugal.” Native keyboard and mobile pickers work.' },
    },
  ],
  combobox: [
    {
      topic: 'Connect the input to its list',
      bad: { code: `<input placeholder="Airport">\n<ul class="suggestions">\n  <li>Lisbon (LIS)</li>\n</ul>`, experience: 'Suggestions appear visually, but screen readers aren’t told, and arrow keys don’t reach them.' },
      good: { code: `<label for="air">Airport</label>\n<input id="air" role="combobox" aria-expanded="true" aria-controls="air-list" aria-autocomplete="list" aria-activedescendant="o1">\n<ul id="air-list" role="listbox">\n  <li id="o1" role="option" aria-selected="true">Lisbon (LIS)</li>\n</ul>`, experience: '“Airport, combo box, expanded.” Arrow keys move through options and each is read.' },
    },
  ],
  slider: [
    {
      topic: 'Show and announce the value',
      bad: { code: `<div class="track"><div class="thumb" draggable="true"></div></div>`, experience: 'Mouse drag only. No keyboard, no value, no name.' },
      good: { code: `<label for="vol">Volume</label>\n<input id="vol" type="range" min="0" max="100" value="40" aria-describedby="vol-out">\n<output id="vol-out" for="vol">40%</output>`, experience: '“Volume, slider, 40.” Arrow keys change it; the value is visible as text.' },
    },
  ],
  'date-picker': [
    {
      topic: 'Let people type the date',
      bad: { code: `<input readonly placeholder="Pick a date" onclick="openCalendar()">`, experience: 'Typing is blocked, so keyboard and screen reader users must use a complex calendar grid.' },
      good: { code: `<label for="d">Date of visit</label>\n<p id="d-hint">For example, 27/3/2026</p>\n<input id="d" inputmode="numeric" aria-describedby="d-hint">\n<button type="button">Choose date<span class="sr-only"> of visit</span></button>`, experience: 'People can type the date with the format hint; the calendar is optional.' },
    },
  ],
  'file-upload': [
    {
      topic: 'Keep the native file input',
      bad: { code: `<div class="dropzone">Drop files here</div>`, experience: 'Only works by dragging. Keyboard, voice and many mobile users can’t add a file.' },
      good: { code: `<label for="files">Upload receipts</label>\n<p id="files-hint">PDF or image, up to 5 MB each.</p>\n<input id="files" type="file" multiple aria-describedby="files-hint">`, experience: 'A Choose files button works everywhere; the limits are read on focus.' },
    },
  ],
  'error-summary': [
    {
      topic: 'Link each error to its field and move focus',
      bad: { code: `<p class="red">Please fix the errors below.</p>`, experience: 'Doesn’t say which errors or where. Focus stays on the button, so screen reader users may not hear it.' },
      good: { code: `<div role="alert" tabindex="-1">\n  <h2>There is a problem</h2>\n  <ul>\n    <li><a href="#email">Enter an email address in the correct format</a></li>\n  </ul>\n</div>`, experience: 'Focus moves to the summary, it’s read out, and each link takes people to the field.' },
    },
  ],
  dialog: [
    {
      topic: 'Use a real modal dialog',
      bad: { code: `<div class="modal">\n  <p>Delete this project?</p>\n  <span onclick="close()">×</span>\n</div>`, experience: 'Focus stays behind the overlay, Tab wanders into the page, and the × can’t be reached by keyboard.' },
      good: { code: `<dialog aria-labelledby="dlg-title">\n  <h2 id="dlg-title">Delete this project?</h2>\n  <button type="button">Delete project</button>\n  <button type="button">Keep project</button>\n</dialog>\n<!-- opened with dialog.showModal() -->`, experience: '“Delete this project?, dialog.” Focus is held inside, Escape closes, focus returns to the trigger.' },
    },
  ],
  popover: [
    {
      topic: 'Open on click, not hover',
      bad: { code: `<span onmouseover="show()">ⓘ</span>\n<div class="pop" hidden>Billed on the same day each month.</div>`, experience: 'Touch and keyboard users can’t open it; screen readers never hear the text.' },
      good: { code: `<button type="button" aria-expanded="false" aria-controls="tip">\n  ⓘ<span class="sr-only">More about billing date</span>\n</button>\n<div id="tip" role="status"></div>`, experience: '“More about billing date, button.” On click, the text is put in the status and read.' },
    },
  ],
  drawer: [
    {
      topic: 'Hide closed drawers properly',
      bad: { code: `<aside class="drawer" style="transform: translateX(100%)">\n  <a href="/settings">Settings</a>\n</aside>`, experience: 'Moved off screen but still in the tab order. Focus disappears into invisible links.' },
      good: { code: `<aside class="drawer" aria-labelledby="dt" hidden>\n  <h2 id="dt">Filters</h2>\n  …\n</aside>`, experience: 'hidden removes it from the tab order and the accessibility tree until it opens.' },
    },
  ],
  tooltip: [
    {
      topic: 'Don’t hide essential information in a tooltip',
      bad: { code: `<label for="pw">Password</label>\n<input id="pw" type="password" title="Must be 12 characters with a number">`, experience: 'The rules appear only on mouse hover. Touch and keyboard users never see them.' },
      good: { code: `<label for="pw">Password</label>\n<p id="pw-hint">At least 12 characters, including a number.</p>\n<input id="pw" type="password" aria-describedby="pw-hint">`, experience: 'Everyone sees the rules, and screen readers read them on focus.' },
    },
  ],
  toast: [
    {
      topic: 'Use a live region that already exists',
      bad: { code: `<!-- added to the page after saving -->\n<div class="toast">Changes saved</div>`, experience: 'Appears visually but is never announced, and it may disappear before people can read it.' },
      good: { code: `<!-- in the page from the start -->\n<div role="status" class="toast-region">Changes saved</div>`, experience: '“Changes saved” is announced politely without moving focus.' },
    },
  ],
  alert: [
    {
      topic: 'Don’t rely on color alone',
      bad: { code: `<div style="background:#fee2e2;padding:8px">Your session will end in 2 minutes.</div>`, experience: 'Only the pink background says it’s a warning; it’s not announced if it appears later.' },
      good: { code: `<div role="alert" class="alert-warning">\n  <svg aria-hidden="true">…</svg>\n  <strong>Warning:</strong> Your session will end in 2 minutes.\n</div>`, experience: '“Warning: Your session will end in 2 minutes” is announced, and the word and icon make it clear without color.' },
    },
  ],
  progress: [
    {
      topic: 'Use a progressbar with a value and a name',
      bad: { code: `<div class="bar"><div style="width:40%;background:#2563eb;height:8px"></div></div>`, experience: 'A blue rectangle. Screen readers get nothing.' },
      good: { code: `<label for="up">Uploading vacation.zip</label>\n<progress id="up" max="100" value="40">40%</progress>`, experience: '“Uploading vacation.zip, progress bar, 40%.”' },
    },
  ],
  image: [
    {
      topic: 'Describe what the image tells people',
      bad: { code: `<img src="volunteers.jpg" alt="image">`, experience: '“image, image.” The information in the photo is lost.' },
      good: { code: `<img src="volunteers.jpg" alt="Volunteers planting trees along the riverbank">`, experience: '“Volunteers planting trees along the riverbank, image.”' },
    },
    {
      topic: 'Hide decorative images',
      bad: { code: `<img src="divider.png">`, experience: 'Without alt, some screen readers read the file name: “divider dot png”.' },
      good: { code: `<img src="divider.png" alt="">`, experience: 'Skipped completely; nothing to hear.' },
    },
  ],
  table: [
    {
      topic: 'Use header cells and a caption',
      bad: { code: `<table>\n  <tr><td><b>Invoice</b></td><td><b>Amount</b></td></tr>\n  <tr><td>INV-1042</td><td>£240</td></tr>\n</table>`, experience: 'Bold text isn’t a header. Moving to “£240” doesn’t say it’s the Amount.' },
      good: { code: `<table>\n  <caption>Invoices due in March</caption>\n  <tr><th scope="col">Invoice</th><th scope="col">Amount</th></tr>\n  <tr><td>INV-1042</td><td>£240</td></tr>\n</table>`, experience: '“Invoices due in March, table.” On a cell: “Amount, £240”.' },
    },
  ],
  badge: [
    {
      topic: 'Use words, not just color',
      bad: { code: `<span class="dot" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#dc2626"></span>`, experience: 'A red dot. People who can’t see red, and screen reader users, get nothing.' },
      good: { code: `<span class="badge badge-danger">\n  <svg aria-hidden="true">…</svg> Overdue\n</span>`, experience: '“Overdue” is read with the row, and visible in grayscale.' },
    },
  ],
  avatar: [
    {
      topic: 'Don’t repeat the name',
      bad: { code: `<img src="amara.jpg" alt="Amara Okafor profile picture">\n<span>Amara Okafor</span>`, experience: '“Amara Okafor profile picture, image. Amara Okafor.” Every name is read twice.' },
      good: { code: `<img src="amara.jpg" alt="">\n<span>Amara Okafor</span>`, experience: '“Amara Okafor”, once.' },
    },
  ],
  skeleton: [
    {
      topic: 'Hide the placeholders and announce loading',
      bad: { code: `<ul>\n  <li class="skeleton"></li>\n  <li class="skeleton"></li>\n</ul>`, experience: '“List, 2 items. Blank. Blank.” Nobody knows it’s loading.' },
      good: { code: `<p role="status" class="sr-only">Loading files</p>\n<ul aria-busy="true" aria-label="Recent files">\n  <li aria-hidden="true" class="skeleton"></li>\n</ul>`, experience: '“Loading files”, then “3 files loaded”. The gray shapes are never read.' },
    },
  ],
  'empty-state': [
    {
      topic: 'Explain and offer a next step',
      bad: { code: `<img src="empty-box.svg">`, experience: 'An illustration and nothing else. Screen reader users hear a file name or nothing.' },
      good: { code: `<h2>No projects yet</h2>\n<p>Projects keep your files, tasks and people together.</p>\n<a class="button" href="/projects/new">Create a project</a>`, experience: 'A heading people can find, a reason, and one clear action.' },
    },
  ],
  carousel: [
    {
      topic: 'Give people control of motion',
      bad: { code: `<div class="carousel" data-autoplay="3000">\n  <img src="1.jpg"><img src="2.jpg"><img src="3.jpg">\n</div>`, experience: 'Slides change every 3 seconds with no way to stop. Images have no alt; slides are announced as they change.' },
      good: { code: `<section aria-roledescription="carousel" aria-label="Featured guides">\n  <button type="button">Stop slide rotation</button>\n  <button type="button">Previous slide</button>\n  <button type="button">Next slide</button>\n  <div aria-live="off">\n    <div role="group" aria-roledescription="slide" aria-label="1 of 3">…</div>\n  </div>\n</section>`, experience: 'A Stop button first, rotation pauses on focus, and slides are labelled “1 of 3”.' },
    },
  ],
  'data-grid': [
    {
      topic: 'Keep the grid to one tab stop',
      bad: { code: `<table role="grid">\n  <tr><td tabindex="0">INV-1042</td><td tabindex="0">£240</td>…</tr>\n</table>`, experience: 'Every cell is a tab stop. A 4×20 grid takes 80 presses of Tab to get past.' },
      good: { code: `<table role="grid" aria-labelledby="cap">\n  <caption id="cap">Invoices</caption>\n  <tr><td role="gridcell" tabindex="0">INV-1042</td><td role="gridcell" tabindex="-1">£240</td></tr>\n</table>`, experience: 'One Tab stop; arrow keys move between cells, like a spreadsheet.' },
    },
  ],
  'tree-view': [
    {
      topic: 'Only folders get aria-expanded',
      bad: { code: `<li role="treeitem" aria-expanded="false">Notes.txt</li>`, experience: '“Notes.txt, collapsed.” People try to open a file that has nothing inside.' },
      good: { code: `<li role="treeitem" aria-level="1">Notes.txt</li>`, experience: '“Notes.txt, level 1.” Only folders say expanded or collapsed.' },
    },
  ],
  listbox: [
    {
      topic: 'Show selection with more than color',
      bad: { code: `<li role="option" style="background:#dbeafe">Research</li>`, experience: 'A light blue background is the only sign it’s selected, and screen readers aren’t told.' },
      good: { code: `<li role="option" aria-selected="true">\n  <svg aria-hidden="true">…check…</svg> Research\n</li>`, experience: '“Research, selected.” A check mark shows it visually too.' },
    },
  ],
  card: [
    {
      topic: 'Don’t wrap the whole card in a link',
      bad: { code: `<a href="/guides/spring" class="card">\n  <img src="spring.jpg" alt="Spring">\n  <h3>Spring trail guide</h3>\n  <p>Twelve walks under two hours…</p>\n  <p>8 min read</p>\n</a>`, experience: 'The link name is everything in the card: “Spring Spring trail guide Twelve walks… 8 min read, link”.' },
      good: { code: `<li class="card">\n  <img src="spring.jpg" alt="">\n  <h3><a href="/guides/spring" class="stretched">Spring trail guide</a></h3>\n  <p>Twelve walks under two hours…</p>\n</li>`, experience: '“Spring trail guide, link.” The whole card is still clickable through the stretched link.' },
    },
  ],
  stepper: [
    {
      topic: 'Mark the current step',
      bad: { code: `<div class="steps">\n  <span class="done">1</span><span class="current">2</span><span>3</span>\n</div>`, experience: 'Three numbers. No names, no current step, state shown only by color.' },
      good: { code: `<nav aria-label="Checkout progress">\n  <ol>\n    <li><span class="sr-only">Completed: </span>Your details</li>\n    <li aria-current="step">Delivery</li>\n    <li>Payment</li>\n  </ol>\n</nav>`, experience: '“Completed: Your details. Delivery, current step. Payment.”' },
    },
  ],
  tags: [
    {
      topic: 'Name each remove button',
      bad: { code: `<li>Research <button type="button">×</button></li>\n<li>Design <button type="button">×</button></li>`, experience: '“Times, button. Times, button.” Which tag does each remove?' },
      good: { code: `<li>Research\n  <button type="button"><span aria-hidden="true">×</span><span class="sr-only">Remove Research</span></button>\n</li>`, experience: '“Remove Research, button.” After removing, focus moves to the next tag.' },
    },
  ],
  toolbar: [
    {
      topic: 'Show pressed state for toggles',
      bad: { code: `<button type="button" class="active">B</button>`, experience: '“B, button.” Not whether bold is on, and “B” isn’t a name.' },
      good: { code: `<div role="toolbar" aria-label="Text formatting">\n  <button type="button" aria-pressed="true">\n    <svg aria-hidden="true">…</svg><span class="sr-only">Bold</span>\n  </button>\n</div>`, experience: '“Text formatting, toolbar. Bold, toggle button, pressed.”' },
    },
  ],
  password: [
    {
      topic: 'Allow paste and password managers',
      bad: { code: `<input type="password" autocomplete="off" onpaste="return false">`, experience: 'Password managers can’t fill it and paste is blocked, so people must type long passwords by hand.' },
      good: { code: `<label for="pw">Password</label>\n<input id="pw" type="password" autocomplete="current-password">\n<button type="button" aria-controls="pw">Show<span class="sr-only"> password</span></button>`, experience: 'Managers fill it, paste works, and Show lets people check what they typed.' },
    },
  ],
  'character-count': [
    {
      topic: 'Announce politely, in words',
      bad: { code: `<textarea maxlength="200"></textarea>\n<span aria-live="assertive">180/200</span>`, experience: '“180 slash 200” interrupts after every keystroke, and text is cut off at 200.' },
      good: { code: `<textarea aria-describedby="count"></textarea>\n<p id="count">You have 20 characters remaining</p>\n<p role="status" class="sr-only"><!-- updated after a pause --></p>`, experience: '“You have 20 characters remaining”, once people pause typing.' },
    },
  ],
  'search-field': [
    {
      topic: 'Label the field and name the button',
      bad: { code: `<input placeholder="Search">\n<button><svg viewBox="0 0 20 20" width="16"><circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>`, experience: '“Edit text. Button.” No landmark, no label, no button name.' },
      good: { code: `<form role="search" aria-label="Site">\n  <label for="q" class="sr-only">Search this site</label>\n  <input id="q" type="search">\n  <button type="submit"><svg aria-hidden="true">…</svg><span class="sr-only">Search</span></button>\n</form>`, experience: '“Site, search landmark. Search this site, search edit text. Search, button.”' },
    },
  ],
  'segmented-control': [
    {
      topic: 'Build it from radios',
      bad: { code: `<div class="segments">\n  <button class="on">List</button>\n  <button>Grid</button>\n</div>`, experience: 'Two buttons with no selected state; each is a separate tab stop.' },
      good: { code: `<fieldset>\n  <legend>View trails as</legend>\n  <label><input type="radio" name="v" checked> List</label>\n  <label><input type="radio" name="v"> Grid</label>\n</fieldset>`, experience: '“View trails as, group. List, radio button, checked, 1 of 2.” Arrow keys switch.' },
    },
  ],
  video: [
    {
      topic: 'Captions, a transcript and no autoplay',
      bad: { code: `<video src="tour.mp4" autoplay muted loop></video>`, experience: 'Starts moving on load with no controls, no captions and no transcript.' },
      good: { code: `<video controls preload="metadata">\n  <source src="tour.webm" type="video/webm">\n  <track kind="captions" src="tour.en.vtt" srclang="en" label="English" default>\n</video>\n<details><summary>Transcript</summary>…</details>`, experience: 'People choose when to play, can read captions, and can read the whole thing as text.' },
    },
  ],
  'cookie-banner': [
    {
      topic: 'Make both choices equal',
      bad: { code: `<div class="cookie-modal">\n  <p>We use cookies.</p>\n  <button class="big-green">Accept all</button>\n  <a href="/settings" style="font-size:11px;color:#9ca3af">manage</a>\n</div>`, experience: 'Rejecting is hidden in tiny low-contrast text. A modal blocks the page until people answer.' },
      good: { code: `<div role="region" aria-labelledby="ct">\n  <h2 id="ct">Cookies on Trailmate</h2>\n  <button type="button">Accept analytics cookies</button>\n  <button type="button">Reject analytics cookies</button>\n</div>`, experience: 'Two equal, clearly named choices, and the page stays usable.' },
    },
  ],
  'back-link': [
    {
      topic: 'Use a real link to the previous step',
      bad: { code: `<span onclick="history.back()">‹ Back</span>`, experience: 'Not focusable, not a link, and goes somewhere unexpected if people arrived from elsewhere.' },
      good: { code: `<a href="/checkout/delivery">Back<span class="sr-only"> to delivery</span></a>`, experience: '“Back to delivery, link”, and it always goes to the right step.' },
    },
  ],
  quantity: [
    {
      topic: 'Name the − and + buttons',
      bad: { code: `<button>-</button> <input type="number" value="2"> <button>+</button>`, experience: '“Hyphen, button.” “Plus, button.” And scrolling the page can change the number.' },
      good: { code: `<label for="t">Number of tickets</label>\n<button type="button"><span aria-hidden="true">−</span><span class="sr-only">Decrease number of tickets</span></button>\n<input id="t" inputmode="numeric" value="2">\n<button type="button"><span aria-hidden="true">+</span><span class="sr-only">Increase number of tickets</span></button>`, experience: '“Increase number of tickets, button.” Then “Quantity 3”.' },
    },
  ],
};
