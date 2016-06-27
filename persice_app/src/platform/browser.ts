export * from './browser-directives';
export * from './browser-pipes';
export * from './browser-providers';

import { DIRECTIVES } from './browser-directives';
import { PIPES } from './browser-pipes';
import { PROVIDERS_MAIN, PROVIDERS_SIGNUP } from './browser-providers';


export const PLATFORM_PROVIDERS_MAIN = [
  ...PROVIDERS_MAIN,
  ...DIRECTIVES,
  ...PIPES
];

export const PLATFORM_PROVIDERS_SIGNUP = [
  ...PROVIDERS_SIGNUP,
  ...DIRECTIVES,
  ...PIPES
];
