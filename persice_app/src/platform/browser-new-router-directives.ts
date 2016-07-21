/*
 * These are globally available directives in any template
 */

import { PLATFORM_DIRECTIVES } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

// Angular 2 Router


// application_directives: directives that are global through out the application
export const APPLICATION_DIRECTIVES = [
  ...ROUTER_DIRECTIVES,
];

export const DIRECTIVES_NEW_ROUTER = [
  {provide: PLATFORM_DIRECTIVES, useValue: APPLICATION_DIRECTIVES, multi: true}
];





