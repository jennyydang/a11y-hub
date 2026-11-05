import type { ComponentSpec, Variant } from '../types';
import { WCAG } from '../wcag';

/** Stand-in portrait so the demo works offline. A real avatar is an <img> with a photo. */
const portrait = (bg: string, skin: string, hair: string) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/><circle cx="32" cy="26" r="12" fill="${skin}"/><path d="M20 24a12 12 0 0 1 24 0c-3-5-21-5-24 0Z" fill="${hair}"/><path d="M10 64a22 22 0 0 1 44 0Z" fill="${skin}"/></svg>`,
  );

const PEOPLE = [
  { name: 'Amara Okafor', src: portrait('#bae6fd', '#8d5524', '#1f2937') },
  { name: 'Lucas Ferreira', src: portrait('#fde68a', '#e0ac69', '#78350f') },
  { name: 'Mei Chen', src: portrait('#ddd6fe', '#f1c27d', '#111827') },
  { name: 'Sam Patel', src: portrait('#bbf7d0', '#c68642', '#374151') },
  { name: 'Noor Haddad', src: portrait('#fecaca', '#d4a373', '#44403c') },
];

const img = 'h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-900';

function WithNameDemo() {
  return (
    <ul className="space-y-3">
      {PEOPLE.slice(0, 2).map((p) => (
        <li key={p.name} className="flex items-center gap-3">
          {/* The name is right beside it, so the photo is decorative */}
          <img src={p.src} alt="" className={img} />
          <span className="font-medium">{p.name}</span>
        </li>
      ))}
    </ul>
  );
}

function AloneDemo() {
  const p = PEOPLE[2];
  return (
    <div className="flex items-center gap-3">
      <p className="text-sm">Assigned to</p>
      <img src={p.src} alt={p.name} className={img} />
      <a href="#" onClick={(e) => e.preventDefault()} className="rounded-full focus-ring">
        <img src={PEOPLE[3].src} alt={`${PEOPLE[3].name}’s profile`} className={img} />
      </a>
    </div>
  );
}

function InitialsDemo() {
  const initials = (n: string) => n.split(' ').map((w) => w[0]).join('');
  return (
    <ul className="space-y-3">
      {['Jordan Lee', 'Priya Nair'].map((n, i) => (
        <li key={n} className="flex items-center gap-3">
          <span aria-hidden="true" className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${i ? 'bg-violet-100 text-violet-900 dark:bg-violet-900 dark:text-violet-50' : 'bg-sky-100 text-sky-900 dark:bg-sky-900 dark:text-sky-50'}`}>
            {initials(n)}
          </span>
          <span className="font-medium">{n}</span>
        </li>
      ))}
    </ul>
  );
}

function GroupDemo() {
  const shown = PEOPLE.slice(0, 3);
  const more = PEOPLE.length - shown.length;
  return (
    <div className="flex items-center gap-3">
      <ul aria-label={`Editors: ${PEOPLE.map((p) => p.name).join(', ')}`} className="flex -space-x-2">
        {shown.map((p) => (
          <li key={p.name}>
            <img src={p.src} alt="" className={img} />
          </li>
        ))}
        <li aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-xs font-bold text-gray-900 ring-2 ring-white dark:bg-gray-700 dark:text-gray-50 dark:ring-gray-900">
          +{more}
        </li>
      </ul>
      <p className="text-sm text-muted">{PEOPLE.length} editors</p>
    </div>
  );
}

export const avatarVariants: Variant[] = [
  {
    id: 'with-name',
    label: 'Beside a name',
    description: 'The person’s name is right next to the photo, so the image is decorative: alt="" stops the name being read twice.',
    Demo: WithNameDemo,
    html: `<li class="person">
  <img src="amara.jpg" alt="" class="avatar">
  <span>Amara Okafor</span>
</li>`,
    code: `<li className="flex items-center gap-3">
  <img src={person.photo} alt="" className="h-10 w-10 rounded-full" />
  <span>{person.name}</span>
</li>`,
  },
  {
    id: 'alone',
    label: 'On its own',
    description: 'No visible name, so the alt text is the name. Inside a link, the alt says where the link goes.',
    Demo: AloneDemo,
    html: `<p>Assigned to</p>
<img src="mei.jpg" alt="Mei Chen" class="avatar">

<a href="/people/sam">
  <img src="sam.jpg" alt="Sam Patel’s profile" class="avatar">
</a>`,
    code: `<img src={assignee.photo} alt={assignee.name} className="h-10 w-10 rounded-full" />

<a href={\`/people/\${user.id}\`}>
  <img src={user.photo} alt={\`\${user.name}’s profile\`} className="h-10 w-10 rounded-full" />
</a>`,
  },
  {
    id: 'initials',
    label: 'Initials',
    description: 'When there’s no photo. The initials are hidden from screen readers, because “J L” means nothing; the visible name does the work.',
    Demo: InitialsDemo,
    html: `<li class="person">
  <span class="avatar avatar-initials" aria-hidden="true">JL</span>
  <span>Jordan Lee</span>
</li>`,
    code: `<span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-sky-100 font-bold text-sky-900">
  {initials(person.name)}
</span>
<span>{person.name}</span>`,
  },
  {
    id: 'group',
    label: 'Group',
    description: 'A stack of faces with “+2”. The list gets one name that says who’s in it, and the individual photos are hidden.',
    Demo: GroupDemo,
    html: `<ul class="avatar-stack" aria-label="Editors: Amara Okafor, Lucas Ferreira, Mei Chen, Sam Patel, Noor Haddad">
  <li><img src="amara.jpg" alt=""></li>
  <li><img src="lucas.jpg" alt=""></li>
  <li><img src="mei.jpg" alt=""></li>
  <li aria-hidden="true">+2</li>
</ul>
<p>5 editors</p>`,
    code: `<ul aria-label={\`Editors: \${people.map((p) => p.name).join(', ')}\`} className="flex -space-x-2">
  {people.slice(0, 3).map((p) => (
    <li key={p.id}><img src={p.photo} alt="" className="h-10 w-10 rounded-full" /></li>
  ))}
  <li aria-hidden="true">+{people.length - 3}</li>
</ul>`,
  },
];

export const avatar: ComponentSpec = {
  slug: 'avatar',
  name: 'Avatar',
  category: 'Content',
  summary: 'An avatar is a small photo or initials that represents a person. Whether it needs alt text depends on whether the name is already shown.',
  semantics: '<img> with alt (or alt="" when the name is next to it)',
  whenToUse: [
    'Use avatars to help people recognize who did something, alongside a name.',
    'Use a group stack when space is tight, with the full list available in text.',
    'Don’t use an avatar as the only way to identify someone.',
  ],
  keyboard: [{ keys: ['—'], action: 'Avatars aren’t focusable. If one is a link, the alt text becomes the link name.' }],
  aria: [
    { attr: 'alt=""', where: 'photo beside a visible name', usage: 'Decorative; stops the name being read twice.' },
    { attr: 'alt="{name}"', where: 'photo on its own', usage: 'The person’s name, not a description of the photo.' },
    { attr: 'aria-hidden="true"', where: 'initials, “+2” counter', usage: 'Letters and counts that make no sense read aloud.' },
    { attr: 'aria-label', where: 'avatar group list', usage: 'Names everyone in the group, or point to text that does.' },
  ],
  focus: ['Only linked avatars take focus. Give them a visible focus ring that follows the round shape.'],
  screenReader: [
    'Beside a name: only the name is read, “Amara Okafor”.',
    'Alone: “Mei Chen, image”. Linked: “Sam Patel’s profile, link”.',
    'Group: “Editors: Amara Okafor, Lucas Ferreira…, list, 4 items”.',
  ],
  dos: ['Use the person’s name as the alt text, not “profile photo”.', 'Always show the name somewhere nearby or in the alt.', 'Give initials 4.5:1 contrast against their fill.'],
  donts: ['Don’t describe what the person looks like.', 'Don’t write alt="avatar" or alt="user".', 'Don’t hide who’s in a group behind “+3” with no text alternative.'],
  wcag: [WCAG.nonText, WCAG.infoRel, WCAG.contrast, WCAG.linkPurpose],
  testing: [
    'With a screen reader, read a list of people and confirm no name is read twice.',
    'Confirm avatars on their own announce the person’s name.',
    'Confirm linked avatars say where they go.',
    'Check initials have 4.5:1 contrast and the focus ring is visible on linked avatars.',
    'Break the image (block images) and confirm people can still be identified.',
  ],
  Demo: WithNameDemo,
  code: avatarVariants[0].code,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: [
      'Fluid UI doesn’t ship an avatar. This uses a native <img> with Tailwind’s rounded-full and Fluid color tokens for initials.',
      'The white ring around stacked avatars switches to the page color in dark mode, so the overlap stays visible.',
    ],
  },
};
