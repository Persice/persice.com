export * from './browser-directives';
export * from './browser-pipes';
export * from './browser-providers';

import { PIPES } from './browser-pipes';
import { PROVIDERS_MAIN, PROVIDERS_MAIN_MOBILE } from './browser-providers';
import { DIRECTIVES } from './browser-directives';

export const PLATFORM_PROVIDERS_MAIN = [
  ...PROVIDERS_MAIN,
  ...DIRECTIVES,
  ...PIPES
];

export const PLATFORM_PROVIDERS_MAIN_MOBILE = [
  ...PROVIDERS_MAIN_MOBILE,
  ...DIRECTIVES,
  ...PIPES
];
