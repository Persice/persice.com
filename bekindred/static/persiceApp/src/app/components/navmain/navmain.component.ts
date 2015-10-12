/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef, Inject} from 'angular2/angular2';
import {RouterLink, Location, Router} from 'angular2/router';

let view = require('./navmain.html');
@Component({
  selector: 'nav-main'
})
@View({
  template: view,
  directives: [RouterLink]
})
export class NavMainComponent {
  location: Location;
  router: Router;
  constructor(router: Router, location: Location) {
    this.router = router;
    this.location = location;
  }
  isLinkActive(path) {
    return this.location.path() === path;
  }
}
