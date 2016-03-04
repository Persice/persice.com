import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Icon} from '../icon/icon';

let view = require('./navmain.html');
@Component({
  selector: 'nav-main',
  template: view,
  directives: [
    ROUTER_DIRECTIVES,
    Icon
  ]
})
export class NavMainComponent {

}
