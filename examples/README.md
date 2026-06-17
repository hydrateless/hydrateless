# Examples

Runnable examples showing Hydrateless across vanilla HTML and every framework
binding. The framework apps use `file:` dependencies that point at the packages
in this repo, so they run against your local build, no publish required.

## Build the packages first

From the repository root:

```bash
npm install
npm run build
```

## Vanilla (no build step)

[`index.html`](./index.html) loads the CSS and the `@hydrateless/auto`
initializer straight from the local build via an import map. Open it directly,
or serve the repo root with any static server:

```bash
npx serve .
# then open /examples/index.html
```

## Framework apps

Each app is a standalone Vite (or Astro) project. From inside the app folder:

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
```

| App                   | Stack           | Highlights                                                                 |
| --------------------- | --------------- | -------------------------------------------------------------------------- |
| [`react/`](./react)   | React 18 + Vite | Compound components, controlled `Modal`, `useToast`, `Combobox`            |
| [`vue/`](./vue)       | Vue 3 + Vite    | Same suite with `v-model` and slot-based composition                       |
| [`svelte/`](./svelte) | Svelte 5 + Vite | Runes, `bind:`, snippets, `useToast`                                       |
| [`astro/`](./astro)   | Astro 5         | Static HTML + `@hydrateless/auto` lazy-loading enhancers only where needed |

Every framework app renders the **same component suite** with an identical API
surface; only the framework idioms differ. See the
[framework guides](https://hydrateless.com/frameworks/react)
for the full API.
