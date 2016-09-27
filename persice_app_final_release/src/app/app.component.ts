import { AfterContentInit, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'persice-app',
  styleUrls: [ './app.component.css' ],
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
