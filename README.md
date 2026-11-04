# A11y Hub

A documentation site and interactive component library focused on the accessibility of common web components. Each component page covers:

- **HTML code** for every component: semantic markup, ARIA and minimal vanilla JavaScript, so you don't need React or Fluid UI to use it. React + Fluid UI code is in a second tab.
- **Live example** built with [Fluid UI](https://fluid-design.io/), with a vision simulator (protanopia, deuteranopia, tritanopia, achromatopsia, blur) and a **screen reader inspector**. The inspector shows the focused element's role, accessible name, states and approximate live-region announcements.
- **Usage**: when to use it and when to use something else
- **Keyboard interactions** and **ARIA** reference tables
- **Focus and screen reader** behavior
- **Do / Don't** guidance
- **Fluid UI notes**: how the component is built with Fluid UI and which accessibility gaps were patched
- **WCAG 2.2 criteria**, linked to the W3C Understanding docs
- **Testing checklist**, with progress saved in `localStorage`

There are 27 components, three **role guides** (content, design and frontend) with review checklists and handoff notes, and each component page has a "Who owns what" section split by role.

There are also foundation pages (keyboard, focus, color and contrast with a contrast checker, semantics and ARIA, motion, text and reflow) and a combined testing checklist page.

## Stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [Fluid UI](https://github.com/fluid-design-io/fluid-ui) (`@fluid-design/fluid-ui`) with its Tailwind plugins, on Tailwind CSS 3
- Headless UI (the same primitives Fluid UI uses) for components Fluid UI doesn't provide
- React Router (hash routing, so the static build works on any host)

Fluid UI 2.6 requires React 17/18 and Tailwind 3, which is why those versions are pinned.

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check and build to dist/
npm run preview    # serve the production build
```

## Project layout

```
src/
  components/   site chrome: layout, demo stage + inspector, tables, checklist
  data/
    components/ one spec file per component (content + live demo)
    foundations.ts
    html.ts       framework-free HTML examples
    roles.ts      role guides and per-component role notes
    wcag.ts     WCAG 2.2 success criteria used across the site
  lib/          simplified accessibility-tree inspector
  pages/        route components
  tools/        contrast checker, motion demo
  ui/           accessible primitives styled with Fluid tokens
```

### Adding a component

1. Create `src/data/components/<slug>.tsx` that exports a `ComponentSpec` (see `src/data/types.ts`).
2. Add it to the `components` array in `src/data/components/index.ts`.
3. Add its plain HTML example to `htmlExamples` in `src/data/html.ts`.
4. Add its content, design and frontend notes to `componentRoles` in `src/data/roles.ts`.

It will show up in the navigation, the components index and the testing checklist automatically.
