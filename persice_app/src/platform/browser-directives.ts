/*
 * These are globally available directives in any template
 */

// Angular 2
import { PLATFORM_DIRECTIVES } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';

// Angular 2 Router

// Angular 2 forms

// application_directives: directives that are global through out the application
export const APPLICATION_DIRECTIVES = [
  ...ROUTER_DIRECTIVES,
  ...REACTIVE_FORM_DIRECTIVES
];

export const DIRECTIVES = [
  {provide: PLATFORM_DIRECTIVES, useValue: APPLICATION_DIRECTIVES, multi: true}
];




