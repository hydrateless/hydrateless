import { Children, createContext, createElement, isValidElement, type ReactNode } from 'react';

/**
 * Position of a child among its siblings of the same component type. Tabs,
 * panels, and accordion items read it to derive their default value (the
 * index) during render, which is what lets them paint `aria-selected`,
 * `hidden`, and `open` on the server before any enhancer runs.
 */
export const IndexContext = createContext(0);

/**
 * Wrap every direct child of type `type` in an {@link IndexContext} provider
 * carrying its ordinal among those children; other children pass through. A
 * render-time counter can't do this reliably (memoized children skip renders,
 * StrictMode double-invokes), so the parent walks its children instead.
 */
export function indexChildren(children: ReactNode, type: unknown): ReactNode {
  let index = 0;
  return Children.map(children, (child) => {
    if (!isValidElement(child) || child.type !== type) return child;
    return createElement(IndexContext.Provider, { value: index++, key: child.key }, child);
  });
}
