import type { ComponentCategory, ComponentSpec } from '../types';
import { accordion } from './accordion';
import { alert } from './alert';
import { button } from './button';
import { checkbox } from './checkbox';
import { combobox } from './combobox';
import { dialog } from './dialog';
import { image } from './image';
import { link } from './link';
import { menu } from './menu';
import { progress } from './progress';
import { radioGroup } from './radio-group';
import { select } from './select';
import { switchSpec } from './switch';
import { table } from './table';
import { tabs } from './tabs';
import { textInput } from './text-input';
import { textarea } from './textarea';
import { slider } from './slider';
import { datePicker } from './date-picker';
import { fileUpload } from './file-upload';
import { errorSummary } from './error-summary';
import { breadcrumbs } from './breadcrumbs';
import { pagination } from './pagination';
import { siteNavigation } from './site-navigation';
import { skipLink } from './skip-link';
import { toast } from './toast';
import { tooltip } from './tooltip';

export const components: ComponentSpec[] = [
  button,
  menu,
  link,
  siteNavigation,
  breadcrumbs,
  pagination,
  skipLink,
  tabs,
  accordion,
  textInput,
  textarea,
  checkbox,
  radioGroup,
  switchSpec,
  select,
  combobox,
  slider,
  datePicker,
  fileUpload,
  errorSummary,
  dialog,
  tooltip,
  toast,
  alert,
  progress,
  image,
  table,
];

export const categories: ComponentCategory[] = ['Actions', 'Navigation', 'Forms', 'Overlays', 'Feedback', 'Content'];

export function byCategory(cat: ComponentCategory) {
  return components.filter((c) => c.category === cat).sort((a, b) => a.name.localeCompare(b.name));
}

export function findComponent(slug: string) {
  return components.find((c) => c.slug === slug);
}
