import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';

@Component({
  selector: 'prs-events-list-subnav',
  template: require('./events-list-subnav.html'),
  directives: [ROUTER_DIRECTIVES]
})


export class EventsListSubnavComponent {
  router: Router;
  constructor(router: Router) {
    this.router = router;
  }
}
