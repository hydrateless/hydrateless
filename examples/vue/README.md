# Hydrateless Vue example

A minimal Vite + Vue 3 app using `@hydrateless/vue`. It showcases the compound
component API with `v-model` two-way binding (`Input`, `Combobox`,
`Pagination`), slot-based composition (`Tabs`, `Dropdown`), a controlled
`Modal`, and imperative toasts via `useToast`.

```bash
npm install
npm run dev
```

The app depends on the local packages via `file:` paths, so run
`npm run build` at the repository root first.
