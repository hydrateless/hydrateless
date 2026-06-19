import type { Category, ComponentDoc } from './types';
import { components } from './components';

/** Categories in canonical display order. */
export const CATEGORIES: Category[] = [
  'Forms',
  'Actions & Overlays',
  'Disclosure',
  'Feedback',
  'Data Display',
  'Navigation',
];

const bySlug = new Map<string, ComponentDoc>(components.map((c) => [c.slug, c]));

/** Every component, in registration order. */
export const allComponents: ComponentDoc[] = components;

/** Look up one component's doc by slug. */
export function getComponent(slug: string): ComponentDoc | undefined {
  return bySlug.get(slug);
}

/** Group components by category, preserving category and registration order. */
export function componentsByCategory(): { category: Category; items: ComponentDoc[] }[] {
  return CATEGORIES.map((category) => ({
    category,
    items: components.filter((c) => c.category === category),
  })).filter((group) => group.items.length > 0);
}

/** Total count, handy for the gallery header and the landing page. */
export const componentCount = components.length;
