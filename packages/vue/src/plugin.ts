import type { App, Plugin } from 'vue';
import { directives } from './directives.js';

/**
 * Registers every Hydrateless directive globally:
 *
 * ```ts
 * import { HydratelessPlugin } from '@hydrateless/vue';
 * createApp(App).use(HydratelessPlugin);
 * ```
 *
 * Then use `v-hl-tabs`, `v-hl-dropdown`, etc. in templates.
 */
export const HydratelessPlugin: Plugin = {
  install(app: App) {
    for (const [name, directive] of Object.entries(directives)) {
      app.directive(name, directive);
    }
  },
};
