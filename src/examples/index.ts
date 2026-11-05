import { signup } from './signup';
import { search } from './search';
import { dashboard } from './dashboard';
import { article } from './article';
import type { Example } from './kit';

export const examples: Example[] = [article, signup, search, dashboard];
export const findExample = (id: string) => examples.find((e) => e.id === id);
