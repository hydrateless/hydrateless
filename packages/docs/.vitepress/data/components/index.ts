import type { ComponentDoc } from '../types';

import { button } from './button';
import { input } from './input';
import { textarea } from './textarea';
import { select } from './select';
import { checkbox } from './checkbox';
import { radioGroup } from './radio-group';
import { switchToggle } from './switch';
import { slider } from './slider';
import { segmentedControl } from './segmented-control';
import { combobox } from './combobox';
import { field } from './field';

import { dropdown } from './dropdown';
import { menu } from './menu';
import { modal } from './modal';
import { drawer } from './drawer';
import { popover } from './popover';
import { tooltip } from './tooltip';
import { commandPalette } from './command-palette';

import { accordion } from './accordion';
import { disclosure } from './disclosure';
import { tabs } from './tabs';

import { alert } from './alert';
import { badge } from './badge';
import { progress } from './progress';
import { spinner } from './spinner';
import { skeleton } from './skeleton';
import { toast } from './toast';

import { card } from './card';
import { avatar } from './avatar';
import { table } from './table';
import { kbd } from './kbd';

import { breadcrumb } from './breadcrumb';
import { pagination } from './pagination';
import { toc } from './toc';
import { skipLink } from './skip-link';
import { separator } from './separator';

/** Every component, in sidebar/gallery display order. */
export const components: ComponentDoc[] = [
  // Forms
  button,
  input,
  textarea,
  select,
  checkbox,
  radioGroup,
  switchToggle,
  slider,
  segmentedControl,
  combobox,
  field,
  // Actions & Overlays
  dropdown,
  menu,
  modal,
  drawer,
  popover,
  tooltip,
  commandPalette,
  // Disclosure
  accordion,
  disclosure,
  tabs,
  // Feedback
  alert,
  badge,
  progress,
  spinner,
  skeleton,
  toast,
  // Data Display
  card,
  avatar,
  table,
  kbd,
  // Navigation
  breadcrumb,
  pagination,
  toc,
  skipLink,
  separator,
];
