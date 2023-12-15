import { AfterContentInit, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'persice-app',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterContentInit {
  showMonitor = (ENV === 'development' &&
    [ 'monitor', 'both' ].includes(STORE_DEV_TOOLS) // set in constants.js file in project root
  );

  constructor(
    public route: ActivatedRoute,
    public router: Router
  ) { }

  ngAfterContentInit() {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
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