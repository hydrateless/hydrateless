import { defineEnhancer } from '../core/define.js';
import { Events } from '../core/events.js';

/** Options for {@link enhanceDisclosure}. */
export type EnhanceDisclosureOptions = {
  /** Open the disclosure immediately on enhance. Defaults to the markup's `open` attribute. */
  defaultOpen?: boolean;
  /** Called after the disclosure opens or closes. */
  onOpenChange?: (open: boolean) => void;
};

/** Imperative handle returned by {@link enhanceDisclosure}. */
export type DisclosureApi = {
  /** Whether the disclosure is currently open. */
  readonly open: boolean;
  /** Open or close the disclosure. */
  setOpen: (open: boolean) => void;
};

/**
 * Observable state for a single native `<details data-hl-disclosure>`. The
 * platform owns the whole widget: `<summary>` toggles it with no JavaScript,
 * and exclusive groups need no script either; give related disclosures the
 * same `name` attribute and the browser closes the others. This enhancer only
 * mirrors the native open/close into `onOpenChange`/`hl:open-change` and
 * exposes an imperative API for controlled framework bindings.
 */
export const enhanceDisclosure = defineEnhancer<EnhanceDisclosureOptions, DisclosureApi>({
  name: 'disclosure',
  selector: 'details[data-hl-disclosure]',
  attributes: { defaultOpen: 'boolean' },
  setup({ root, options, on, emit }) {
    const details = root as HTMLDetailsElement;

    if (options.defaultOpen != null) details.open = options.defaultOpen;

    let last = details.open;
    on(details, 'toggle', () => {
      if (details.open === last) return;
      last = details.open;
      options.onOpenChange?.(details.open);
      emit(Events.openChange, { open: details.open });
    });

    return {
      get open() {
        return details.open;
      },
      setOpen(next) {
        details.open = next;
      },
    };
  },
});
