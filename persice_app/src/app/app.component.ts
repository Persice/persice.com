import { Component, ViewEncapsulation } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { ROUTER_DIRECTIVES } from '@angular/router';

/*
 * Persice App Component
 * Top Level Component
 */

@Component({
  selector: 'persice-app',
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    ROUTER_DIRECTIVES
  ],
  encapsulation: ViewEncapsulation.None,
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {

}
