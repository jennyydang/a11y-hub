import { mainNavigation } from './main-navigation';
import { heroBanner } from './hero-banner';
import { productListing } from './product-listing';
import { productGallery } from './product-gallery';
import { buyBox } from './buy-box';
import type { Pattern } from './types';

export type { Pattern } from './types';

export const patterns: Pattern[] = [mainNavigation, heroBanner, productListing, productGallery, buyBox];

export const findPattern = (slug: string) => patterns.find((p) => p.slug === slug);
