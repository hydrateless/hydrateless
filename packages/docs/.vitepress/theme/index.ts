import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import 'hydrateless/hydrateless.css';
import './custom.css';

import Demo from './components/Demo.vue';
import CodeView from './components/CodeView.vue';
import FrameworkSwitcher from './components/FrameworkSwitcher.vue';
import Knobs from './components/Knobs.vue';
import PropsTable from './components/PropsTable.vue';
import EventsTable from './components/EventsTable.vue';
import TokensTable from './components/TokensTable.vue';
import ComponentMeta from './components/ComponentMeta.vue';
import ComponentDoc from './components/ComponentDoc.vue';
import ComponentGallery from './components/ComponentGallery.vue';
import ThemeStudio from './components/ThemeStudio.vue';
import InstallTabs from './components/InstallTabs.vue';

// Note: unlike before, the docs do not call `auto(document)` globally. Each
// `<Demo>` owns its own scoped enhancement, which is what makes the per-demo
// "disable JS" toggle meaningful (no global watcher races to re-enhance).
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Demo', Demo);
    app.component('CodeView', CodeView);
    app.component('FrameworkSwitcher', FrameworkSwitcher);
    app.component('Knobs', Knobs);
    app.component('PropsTable', PropsTable);
    app.component('EventsTable', EventsTable);
    app.component('TokensTable', TokensTable);
    app.component('ComponentMeta', ComponentMeta);
    app.component('ComponentDoc', ComponentDoc);
    app.component('ComponentGallery', ComponentGallery);
    app.component('ThemeStudio', ThemeStudio);
    app.component('InstallTabs', InstallTabs);
  },
} satisfies Theme;
