// Shared fixture bootstrapper. With `?js=off` the page stays a pure no-JS
// baseline (semantic HTML + CSS only); otherwise it imports the self-contained
// CDN auto bundle, which scans the document and upgrades every `data-hl-*`
// component. Either way it stamps `data-hl-mode` on <html> once setup settles so
// specs can wait for a deterministic ready state.
const params = new URLSearchParams(location.search);
const enhance = params.get('js') !== 'off';

async function boot() {
  if (enhance) {
    await import('/packages/auto/dist/hydrateless.js');
  }
  document.documentElement.dataset.hlMode = enhance ? 'enhanced' : 'baseline';
}

boot();
