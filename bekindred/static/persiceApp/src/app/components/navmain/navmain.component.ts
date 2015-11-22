/// <reference path="../../../typings/_custom.d.ts" />

import {Component} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

let view = require('./navmain.html');
@Component({
  selector: 'nav-main',
  template: view,
  directives: [ROUTER_DIRECTIVES]
})
export class NavMainComponent {

}
