import type { ComponentCategory, ComponentSpec } from '../types';
import { accordion } from './accordion';
import { alert } from './alert';
import { button } from './button';
import { checkbox } from './checkbox';
import { combobox } from './combobox';
import { dialog } from './dialog';
import { popover, popoverVariants } from './popover';
import { drawer, drawerVariants } from './drawer';
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
import { badge, badgeVariants } from './badge';
import { avatar, avatarVariants } from './avatar';
import { skeleton } from './skeleton';
import { emptyState, emptyStateVariants } from './empty-state';
import { carousel, carouselVariants } from './carousel';
import { dataGrid } from './data-grid';
import { treeView } from './tree-view';
import { listbox, listboxVariants } from './listbox';
import { card, cardVariants } from './card';
import { stepper } from './stepper';
import { tags } from './tags';
import { toolbar } from './toolbar';
import { password, passwordVariants } from './password';
import { characterCount } from './character-count';
import { searchField } from './search-field';
import { segmentedControl } from './segmented-control';
import { video } from './video';
import { cookieBanner } from './cookie-banner';
import { backLink } from './back-link';
import { quantity } from './quantity';

import { buttonVariants } from '../variants/button';
import { linkVariants } from '../variants/link';
import { textInputVariants } from '../variants/text-input';
import { checkboxVariants } from '../variants/checkbox';
import { tabsVariants } from '../variants/tabs';
import { accordionVariants } from '../variants/accordion';
import { alertVariants } from '../variants/alert';
import { tooltipVariants } from '../variants/tooltip';
import { toastVariants } from '../variants/toast';
import { progressVariants } from '../variants/progress';
import { imageVariants } from '../variants/image';
import { selectVariants } from '../variants/select';
import { datePickerVariants } from '../variants/date-picker';
import { tableVariants } from '../variants/table';

button.variants = buttonVariants;
link.variants = linkVariants;
textInput.variants = textInputVariants;
checkbox.variants = checkboxVariants;
tabs.variants = tabsVariants;
accordion.variants = accordionVariants;
alert.variants = alertVariants;
tooltip.variants = tooltipVariants;
toast.variants = toastVariants;
progress.variants = progressVariants;
image.variants = imageVariants;
select.variants = selectVariants;
datePicker.variants = datePickerVariants;
table.variants = tableVariants;
popover.variants = popoverVariants;
drawer.variants = drawerVariants;
badge.variants = badgeVariants;
avatar.variants = avatarVariants;
emptyState.variants = emptyStateVariants;
carousel.variants = carouselVariants;
listbox.variants = listboxVariants;
card.variants = cardVariants;
password.variants = passwordVariants;

export const components: ComponentSpec[] = [
  button,
  menu,
  toolbar,
  link,
  siteNavigation,
  breadcrumbs,
  backLink,
  pagination,
  stepper,
  skipLink,
  tabs,
  accordion,
  textInput,
  password,
  searchField,
  textarea,
  characterCount,
  checkbox,
  radioGroup,
  segmentedControl,
  switchSpec,
  select,
  combobox,
  listbox,
  tags,
  slider,
  quantity,
  datePicker,
  fileUpload,
  errorSummary,
  dialog,
  popover,
  drawer,
  tooltip,
  toast,
  alert,
  cookieBanner,
  progress,
  skeleton,
  badge,
  image,
  avatar,
  video,
  carousel,
  card,
  emptyState,
  table,
  dataGrid,
  treeView,
];

export const categories: ComponentCategory[] = ['Actions', 'Navigation', 'Forms', 'Overlays', 'Feedback', 'Content', 'Data'];

export function byCategory(cat: ComponentCategory) {
  return components.filter((c) => c.category === cat).sort((a, b) => a.name.localeCompare(b.name));
}

export function findComponent(slug: string) {
  return components.find((c) => c.slug === slug);
}
