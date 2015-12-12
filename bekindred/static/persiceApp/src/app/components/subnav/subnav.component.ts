import {Component} from 'angular2/angular2';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';


let view = require('./subnav.html');
@Component({
  selector: 'subnav',
  template: view,
  directives: [ROUTER_DIRECTIVES]
})


export class SubnavComponent {
  router: Router;
  constructor(router: Router) {
    this.router = router;
  }
}
