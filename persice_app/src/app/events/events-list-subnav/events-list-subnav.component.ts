import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

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
