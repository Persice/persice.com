import { Component, ViewEncapsulation, ApplicationRef } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { ROUTER_DIRECTIVES, Router, NavigationEnd } from '@angular/router';

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
export class AppMobileComponent {

  constructor(
    private router: Router,
    private ref: ApplicationRef
  ) {

  }

  ngOnInit() {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        setTimeout(() => {
          if (this.ref.zone) {
            this.ref.zone.run(() => this.ref.tick());
          }
        });
      }
    });
  }

}
