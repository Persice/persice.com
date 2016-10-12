import { Component, ViewEncapsulation, OnInit, ApplicationRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'persice-app-mobile',
  templateUrl: './app-mobile.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppMobileComponent implements OnInit {
  showMonitor = (ENV === 'development' &&
    [ 'monitor', 'both' ].includes(STORE_DEV_TOOLS) // set in constants.js file in project root
  );

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public ref: ApplicationRef
  ) { }

  ngOnInit() {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.ref.tick();
        setTimeout(() => {
          document.body.scrollTop = 0;
        });
      }
    });
  }

  activateEvent(event) {
    if (ENV === 'development') {
      // console.log('Activate Event:', event);
    }
  }

  deactivateEvent(event) {
    if (ENV === 'development') {
      // console.log('Deactivate Event', event);
    }
  }
}
