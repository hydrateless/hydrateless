import { getWindow, isBrowser, isRtl } from './dom.js';
import { combine, noop, on, type Disposer } from './lifecycle.js';

/**
 * Edge of the anchor a floating element is placed against. `start` and `end`
 * are logical inline sides, so a placement mirrors under `dir="rtl"`.
 */
export type Side = 'top' | 'bottom' | 'start' | 'end';
/** Alignment of a floating element along its chosen side. */
export type Align = 'start' | 'center' | 'end';
/** A {@link Side}, optionally suffixed with an {@link Align} (e.g. `bottom-start`). */
export type Placement = Side | `${Side}-${Align}`;

const SIDES: readonly Side[] = ['top', 'bottom', 'start', 'end'];
const ALIGNS: readonly Align[] = ['start', 'center', 'end'];

/** Parse a `data-hl-placement` attribute; `undefined` when it isn't a valid {@link Placement}. */
export function parsePlacement(raw: string): Placement | undefined {
  const [side, align] = raw.trim().split('-') as [Side, Align?];
  if (!SIDES.includes(side)) return undefined;
  if (align === undefined) return side;
  return ALIGNS.includes(align) ? `${side}-${align}` : undefined;
}

/** Options for {@link positionFallback}. */
export interface PositionOptions {
  /** Preferred placement; flips to the opposite side when there is no room. */
  placement?: Placement;
  /** Gap between the anchor and the floating element, in pixels. */
  gutter?: number;
  /** Viewport edge padding used when shifting, in pixels. */
  padding?: number;
  /** CSS `position` value to apply. Defaults to `fixed`. */
  strategy?: 'absolute' | 'fixed';
}

/** The resolved side and alignment returned by {@link positionFallback}. */
export interface PositionResult {
  side: Side;
  align: Align;
}

/**
 * Whether the engine understands the native Popover API (`popover` attribute,
 * `showPopover`/`hidePopover`, light-dismiss). Baseline since 2024.
 */
export function supportsPopover(): boolean {
  return isBrowser && typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype;
}

/**
 * Whether the engine understands CSS anchor positioning (`anchor-name`,
 * `position-anchor`, `position-area`, `position-try`). Baseline since January
 * 2026. When this is `false`, the enhancers run the JS positioning fallback
 * so floating surfaces are still placed against their anchor.
 */
export function supportsAnchorPositioning(): boolean {
  return (
    isBrowser &&
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('anchor-name', '--x')
  );
}

type Physical = 'top' | 'bottom' | 'left' | 'right';

const OPPOSITE: Record<Physical, Physical> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

function parse(placement: Placement): { side: Side; align: Align } {
  const [side, align = 'center'] = placement.split('-') as [Side, Align?];
  return { side, align: align ?? 'center' };
}

function toPhysical(side: Side, rtl: boolean): Physical {
  if (side === 'start') return rtl ? 'right' : 'left';
  if (side === 'end') return rtl ? 'left' : 'right';
  return side;
}

function toLogical(side: Physical, rtl: boolean): Side {
  if (side === 'left') return rtl ? 'end' : 'start';
  if (side === 'right') return rtl ? 'start' : 'end';
  return side;
}

/**
 * JavaScript positioning fallback for browsers without CSS anchor positioning.
 * Places `floating` relative to `anchor` with flip + shift collision handling,
 * setting inline `position`/`top`/`left` plus logical `data-hl-side`/
 * `data-hl-align` for CSS to react to (e.g. arrow direction). Modern engines
 * never call this: the stylesheet positions floating surfaces declaratively.
 * No-ops gracefully when the anchor has no layout box (e.g. jsdom).
 */
export function positionFallback(
  anchor: HTMLElement,
  floating: HTMLElement,
  options: PositionOptions = {},
): PositionResult {
  const { placement = 'bottom', gutter = 6, padding = 8, strategy = 'fixed' } = options;
  const rtl = isRtl(anchor);
  const parsed = parse(placement);
  let side = toPhysical(parsed.side, rtl);
  const { align } = parsed;

  const win = getWindow(anchor);
  const anchorRect = anchor.getBoundingClientRect();
  const floatRect = floating.getBoundingClientRect();
  const vw = win.innerWidth || 0;
  const vh = win.innerHeight || 0;

  if (anchorRect.width === 0 && anchorRect.height === 0 && vw === 0) {
    floating.dataset.hlSide = parsed.side;
    floating.dataset.hlAlign = align;
    return { side: parsed.side, align };
  }

  const fits = (s: Physical): boolean => {
    switch (s) {
      case 'top':
        return anchorRect.top - gutter - floatRect.height >= padding;
      case 'bottom':
        return anchorRect.bottom + gutter + floatRect.height <= vh - padding;
      case 'left':
        return anchorRect.left - gutter - floatRect.width >= padding;
      case 'right':
        return anchorRect.right + gutter + floatRect.width <= vw - padding;
    }
  };

  if (!fits(side) && fits(OPPOSITE[side])) side = OPPOSITE[side];

  let top = 0;
  let left = 0;
  const isVertical = side === 'top' || side === 'bottom';
  // Alignment is logical too: `start` hugs the anchor's inline-start edge.
  const alignStart = rtl ? 'end' : 'start';

  if (side === 'bottom') top = anchorRect.bottom + gutter;
  else if (side === 'top') top = anchorRect.top - gutter - floatRect.height;
  else if (side === 'right') left = anchorRect.right + gutter;
  else left = anchorRect.left - gutter - floatRect.width;

  if (isVertical) {
    if (align === alignStart) left = anchorRect.left;
    else if (align !== 'center') left = anchorRect.right - floatRect.width;
    else left = anchorRect.left + anchorRect.width / 2 - floatRect.width / 2;
    left = Math.max(padding, Math.min(left, vw - floatRect.width - padding));
  } else {
    if (align === 'start') top = anchorRect.top;
    else if (align === 'end') top = anchorRect.bottom - floatRect.height;
    else top = anchorRect.top + anchorRect.height / 2 - floatRect.height / 2;
    top = Math.max(padding, Math.min(top, vh - floatRect.height - padding));
  }

  if (strategy === 'absolute') {
    top += win.scrollY;
    left += win.scrollX;
  }

  floating.style.position = strategy;
  floating.style.top = `${Math.round(top)}px`;
  floating.style.left = `${Math.round(left)}px`;
  floating.style.margin = '0';
  const logical = toLogical(side, rtl);
  floating.dataset.hlSide = logical;
  floating.dataset.hlAlign = align;

  return { side: logical, align };
}

/**
 * Keep `floating` placed against `anchor` while it is shown, on engines
 * without CSS anchor positioning. Positions immediately, then again on every
 * scroll (anywhere in the document) and window resize, so a surface opened
 * from a scrolling container follows its anchor instead of drifting. Returns
 * a disposer that stops listening. On engines with anchor positioning it only
 * stamps the requested side onto `data-hl-side` (so the stylesheet can pick a
 * `position-area`) and returns `noop`, so callers can invoke it unconditionally.
 */
export function keepPositioned(
  anchor: HTMLElement,
  floating: HTMLElement,
  options: PositionOptions = {},
): Disposer {
  const { side, align } = parse(options.placement ?? 'bottom');
  if (supportsAnchorPositioning()) {
    floating.dataset.hlSide = side;
    floating.dataset.hlAlign = align;
    return noop;
  }
  const win = getWindow(anchor);
  const doc = anchor.ownerDocument;
  let frame: number | null = null;
  const update = () => positionFallback(anchor, floating, options);
  const schedule = () => {
    if (frame !== null) return;
    frame = win.requestAnimationFrame(() => {
      frame = null;
      update();
    });
  };
  update();
  return combine([
    on(doc, 'scroll', schedule, { capture: true, passive: true }),
    on(win, 'resize', schedule, { passive: true }),
    () => {
      if (frame !== null) win.cancelAnimationFrame(frame);
      frame = null;
    },
  ]);
}
