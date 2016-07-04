export * from './browser-directives';
export * from './browser-pipes';
export * from './browser-providers';

import { DIRECTIVES } from './browser-directives';
import { DIRECTIVES_NEW_ROUTER } from './browser-new-router-directives';
import { PIPES } from './browser-pipes';
import { PROVIDERS_MAIN, PROVIDERS_MAIN_MOBILE, PROVIDERS_SIGNUP, PROVIDERS_SIGNUP_MOBILE } from './browser-providers';


export const PLATFORM_PROVIDERS_MAIN = [
  ...PROVIDERS_MAIN,
  ...DIRECTIVES,
  ...PIPES
];

export const PLATFORM_PROVIDERS_MAIN_MOBILE = [
  ...PROVIDERS_MAIN_MOBILE,
  ...DIRECTIVES_NEW_ROUTER,
  ...PIPES
];

export const PLATFORM_PROVIDERS_SIGNUP = [
  ...PROVIDERS_SIGNUP,
  ...DIRECTIVES,
  ...PIPES
];

export const PLATFORM_PROVIDERS_SIGNUP_MOBILE = [
  ...PROVIDERS_SIGNUP_MOBILE,
  ...DIRECTIVES_NEW_ROUTER,
  ...PIPES
];
