# Table

A styled native `<table>` with optional zebra striping and row hover. CSS-only —
apply the class to standard table markup.

## Demo

<div class="hl-demo">
<table class="hl-table" data-hl-striped data-hl-hover>
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
      <th data-hl-align="end">Commits</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ada Lovelace</td>
      <td>Engineer</td>
      <td data-hl-align="end">128</td>
    </tr>
    <tr>
      <td>Alan Turing</td>
      <td>Researcher</td>
      <td data-hl-align="end">96</td>
    </tr>
  </tbody>
</table>
</div>

## HTML

```html
<table class="hl-table" data-hl-striped data-hl-hover>
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
      <th data-hl-align="end">Commits</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ada Lovelace</td>
      <td>Engineer</td>
      <td data-hl-align="end">128</td>
    </tr>
  </tbody>
</table>
```

- **CSS**: `hydrateless/table.css`
- **JS**: none.
- **Modifiers**: boolean `data-hl-striped` and `data-hl-hover` on the `<table>`.
- **Alignment**: `data-hl-align="end"` or `data-hl-align="center"` on a cell.

## Frameworks

::: code-group

```tsx [React]
<table className="hl-table" data-hl-striped data-hl-hover>
  <thead>
    <tr>
      <th>Name</th>
      <th data-hl-align="end">Commits</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ada Lovelace</td>
      <td data-hl-align="end">128</td>
    </tr>
  </tbody>
</table>
```

```vue [Vue]
<template>
  <table class="hl-table" data-hl-striped data-hl-hover>
    <thead>
      <tr>
        <th>Name</th>
        <th data-hl-align="end">Commits</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Ada Lovelace</td>
        <td data-hl-align="end">128</td>
      </tr>
    </tbody>
  </table>
</template>
```

```svelte [Svelte]
<table class="hl-table" data-hl-striped data-hl-hover>
  <thead>
    <tr>
      <th>Name</th>
      <th data-hl-align="end">Commits</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ada Lovelace</td>
      <td data-hl-align="end">128</td>
    </tr>
  </tbody>
</table>
```

:::
