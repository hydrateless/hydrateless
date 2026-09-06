import { computed, onMounted, ref, type Ref } from 'vue';

/** The code flavors the docs can show for any example. */
export type Framework = 'html' | 'react' | 'vue' | 'svelte';

/** Ordered list of frameworks, used to render switchers consistently. */
export const FRAMEWORKS: readonly Framework[] = ['html', 'react', 'vue', 'svelte'];

/** Human-readable labels for each framework. */
export const FRAMEWORK_LABELS: Record<Framework, string> = {
  html: 'HTML',
  react: 'React',
  vue: 'Vue',
  svelte: 'Svelte',
};

/** Fenced-code language used when highlighting each framework's snippet. */
export const FRAMEWORK_LANGS: Record<Framework, string> = {
  html: 'html',
  react: 'tsx',
  vue: 'vue',
  svelte: 'svelte',
};

const STORAGE_KEY = 'hl-docs-framework';

const isFramework = (value: unknown): value is Framework =>
  typeof value === 'string' && (FRAMEWORKS as readonly string[]).includes(value);

// A single module-level ref backs every switcher on the page, so choosing a
// framework once updates every example at the same time.
const framework: Ref<Framework> = ref('html');

let hydrated = false;

/**
 * Read the persisted framework preference. Safe to call on the server (it just
 * returns the default until the client hydrates).
 */
function hydrate(): void {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isFramework(stored)) framework.value = stored;
  } catch {
    // Ignore storage access errors (private mode, disabled cookies, etc.).
  }
}

/**
 * Shared, persisted framework preference. Every component that shows code reads
 * from the same source, so the docs feel like one cohesive switch.
 */
export function useFramework() {
  // Match server-rendered markup until hydration has finished.
  onMounted(hydrate);
  return {
    framework: computed<Framework>({
      get: () => framework.value,
      set: (value) => setFramework(value),
    }),
    setFramework,
  };
}

/** Update the active framework and persist it for the next visit. */
export function setFramework(value: Framework): void {
  framework.value = value;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Ignore storage write failures.
  }
}
