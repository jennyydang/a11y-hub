# Contributing to A11y Hub

A11y Hub is built by the accessibility lead and the design, content, frontend and QA SMEs together. The full process, with who leads each stage and the definition of done, is on the hub at **How we build the hub** (`/process`). This file covers the technical side.

## The stages

1. **Propose:** open a "New component or section" issue. The accessibility lead accepts it and names one SME per role.
2. **Research and cite:** find the APG pattern, the WCAG criteria and at least one tested reference. Record sources in `src/data/sources.ts`.
3. **Draft, by role:** each SME writes their part on one branch.
4. **Review across roles:** each SME reviews another role's part; the lead reviews the whole page.
5. **Test:** `npm test`, keyboard, two screen readers, 400% zoom, reduced motion.
6. **Publish:** merge (the site deploys itself), add a What's new entry and a review date.
7. **Maintain:** review every page at least once a year.

## Setup

```sh
npm ci
npm run dev        # local site
npm test           # builds, then runs Playwright + axe on every page
```

The first time, run `npx playwright install chromium`.

## Adding a component

| What | Where | Who |
|---|---|---|
| Spec: summary, semantics, keyboard, ARIA, focus, dos and don'ts, WCAG, testing, demo, code, Fluid notes | `src/data/components/<slug>.tsx`, registered in `src/data/components/index.ts` | Frontend, with design, content and QA |
| Variations | `src/data/variants/` | Frontend |
| Anatomy | `src/data/anatomy.ts` | Design |
| Placement | `src/data/placement.ts` | Design |
| Good and bad examples | `src/data/goodBad.ts` | Design and content |
| Handoff worksheet: content fields and design requirements | `src/data/requirements.ts` | Content and design |
| Role notes | `componentRoles` in `src/data/roles.ts` | Each role |
| Sources and review date | `src/data/sources.ts` | Accessibility lead |
| New terms | `src/data/glossary.ts` | Content |
| What's new | `CHANGES` in `src/pages/ChangelogPage.tsx` | Content |

## Adding a page or section

- Add the route in `src/App.tsx` and link it from the sidebar in `src/components/Layout.tsx`. The automated tests find pages through the sidebar, so an unlinked page isn't tested.
- Add it to site search in `src/components/Search.tsx`.
- A new section on component pages needs a `SectionKey` in `src/data/roleSections.ts`, added to every role that should see it. Otherwise it's hidden when a reader picks a role.
- Pages for everyday authors (`/basics`) stay free of jargon.

## Writing

- Plain language, short sentences, active voice.
- Wrap jargon with the glossary: `withTerms()` adds a tip to the first mention of a glossary term.
- Never name a client organization in content, samples or notes. Use "Example Client".

## Citing sources

Every requirement should trace back to a source. Prefer, in order: standards (WCAG, HTML, ARIA), the ARIA Authoring Practices Guide, design systems that publish research with disabled users, expert testing with named screen readers and versions, and our own recorded tests. WCAG criteria and the APG pattern on a spec appear on the page automatically; add everything else to `src/data/sources.ts`.

## Motion

Micro-interactions live in one block of `src/index.css`. Keep them short and small, and make sure they're off under `prefers-reduced-motion`.
