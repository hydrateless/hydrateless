import type { Framework } from '../shared/framework';

/** The sidebar/gallery groupings, in display order. */
export type Category =
  | 'Forms'
  | 'Actions & Overlays'
  | 'Disclosure'
  | 'Feedback'
  | 'Data Display'
  | 'Navigation';

/** A single choice in a `select` knob. */
export interface KnobOption {
  label: string;
  value: string;
}

interface KnobBase {
  /** Stable key; demo `render`/`code` functions read values by this id. */
  id: string;
  /** Control label shown in the demo toolbar. */
  label: string;
}

/** A dropdown/segmented choice between string values. */
export interface SelectKnob extends KnobBase {
  type: 'select';
  options: (string | KnobOption)[];
  default: string;
}

/** A checkbox toggling a boolean. */
export interface BooleanKnob extends KnobBase {
  type: 'boolean';
  default: boolean;
}

/** A free-text input. */
export interface TextKnob extends KnobBase {
  type: 'text';
  default: string;
  placeholder?: string;
}

/** A numeric range input. */
export interface NumberKnob extends KnobBase {
  type: 'number';
  default: number;
  min?: number;
  max?: number;
  step?: number;
}

/** Any interactive control attached to a demo. */
export type Knob = SelectKnob | BooleanKnob | TextKnob | NumberKnob;

/** The current value of every knob in a demo, keyed by knob id. */
export type KnobValues = Record<string, string | boolean | number>;

/** Produces a code snippet (or live markup) from the current knob values. */
export type RenderFn = (values: KnobValues) => string;

/** One showcased example for a component. */
export interface DemoDef {
  /** Unique within the component. */
  id: string;
  /** Optional heading shown above the example. */
  title?: string;
  /** Optional supporting prose. */
  description?: string;
  /** How the live preview lays its children out. */
  layout?: 'row' | 'column' | 'center' | 'fill';
  /** Interactive controls; omit for a static example. */
  knobs?: Knob[];
  /** Returns the live HTML markup the preview renders and enhances. */
  render: RenderFn;
  /** Per-framework source snippet. HTML falls back to `render` when omitted. */
  code?: Partial<Record<Framework, RenderFn>>;
}

/** A documented framework-component prop. */
export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

/** A documented event or change callback. */
export interface EventDef {
  /** DOM event name (e.g. `hl:change`) or callback (e.g. `onValueChange`). */
  name: string;
  /** Shape of the event detail or callback argument. */
  detail?: string;
  description: string;
}

/** A CSS custom property the component reads, for the tokens table. */
export interface TokenRef {
  name: string;
  description: string;
}

/** The JS enhancer that powers a component, if any. */
export interface EnhancerRef {
  /** Function name, e.g. `enhanceModal`. */
  fn: string;
  /** Import subpath, e.g. `@hydrateless/enhancers/modal`. */
  subpath: string;
  /** One-line call signature for the docs. */
  signature?: string;
}

/** The complete, data-driven description of one component. */
export interface ComponentDoc {
  slug: string;
  name: string;
  category: Category;
  /** One sentence; used in the gallery and page header. */
  summary: string;
  /** Intro paragraph(s) for the page. Plain prose; no markdown headings. */
  description: string;
  status?: 'stable' | 'beta';
  /** True when the component is fully functional with no JavaScript. */
  cssOnly?: boolean;
  /** Native element(s) the component builds on, e.g. `<details>`. */
  native?: string;
  /** Enhancer metadata when the component has optional JS. */
  enhancer?: EnhancerRef;
  /** Primary stylesheet subpath, e.g. `hydrateless/modal.css`. */
  cssFile: string;
  /** The primary framework export name, e.g. `Modal`. */
  importName?: string;
  demos: DemoDef[];
  props?: PropDef[];
  events?: EventDef[];
  tokens?: TokenRef[];
  a11y?: string[];
  related?: string[];
}
