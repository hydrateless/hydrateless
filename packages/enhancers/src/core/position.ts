import { getWindow } from './dom.js';

/** Edge of the anchor a floating element is placed against. */
export type Side = 'top' | 'bottom' | 'left' | 'right';
/** Alignment of a floating element along its chosen side. */
export type Align = 'start' | 'center' | 'end';
/** A {@link Side}, optionally suffixed with an {@link Align} (e.g. `bottom-start`). */
export type Placement = Side | `${Side}-${Align}`;

/** Options for {@link placeFloating}. */
export interface PositionOptions {
  placement?: Placement;
  /** Gap between the anchor and the floating element, in pixels. */
  gutter?: number;
  /** Viewport edge padding used when shifting, in pixels. */
  padding?: number;
  strategy?: 'absolute' | 'fixed';
}

/** The resolved side and alignment returned by {@link placeFloating}. */
export interface PositionResult {
  side: Side;
  align: Align;
}

const OPPOSITE: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

function parse(placement: Placement): { side: Side; align: Align } {
  const [side, align = 'center'] = placement.split('-') as [Side, Align?];
  return { side, align: align ?? 'center' };
}

/**
 * Position `floating` relative to `anchor` with flip + shift collision
 * handling. Sets inline `position`/`top`/`left` and a `data-hl-side` attribute
 * for CSS to react to (e.g. arrow direction). Returns the resolved side/align.
 *
 * No-ops gracefully when the anchor has no layout box (e.g. jsdom), leaving the
 * floating element where CSS placed it.
 */
export function placeFloating(
  anchor: HTMLElement,
  floating: HTMLElement,
  options: PositionOptions = {},
): PositionResult {
  const { placement = 'bottom', gutter = 6, padding = 8, strategy = 'fixed' } = options;
  const parsed = parse(placement);
  let side = parsed.side;
  const { align } = parsed;

  const win = getWindow(anchor);
  const anchorRect = anchor.getBoundingClientRect();
  const floatRect = floating.getBoundingClientRect();
  const vw = win.innerWidth || 0;
  const vh = win.innerHeight || 0;

  if (anchorRect.width === 0 && anchorRect.height === 0 && vw === 0) {
    floating.dataset.hlSide = side;
    floating.dataset.hlAlign = align;
    return { side, align };
  }

  const fits = (s: Side): boolean => {
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

  if (side === 'bottom') top = anchorRect.bottom + gutter;
  else if (side === 'top') top = anchorRect.top - gutter - floatRect.height;
  else if (side === 'right') left = anchorRect.right + gutter;
  else left = anchorRect.left - gutter - floatRect.width;

  if (isVertical) {
    if (align === 'start') left = anchorRect.left;
    else if (align === 'end') left = anchorRect.right - floatRect.width;
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
  floating.dataset.hlSide = side;
  floating.dataset.hlAlign = align;

  return { side, align };
}
