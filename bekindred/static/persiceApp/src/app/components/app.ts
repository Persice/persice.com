/// <reference path="../../typings/_custom.d.ts" />

/*
 * Angular 2 decorators and services
 */
import {Directive, Component, View, ElementRef} from 'angular2/angular2';
import {RouteConfig, Router} from 'angular2/router';
import {Http, Headers} from 'angular2/http';

/*
 * Angular Directives
 */
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

/*
 * Components
 */

import {LeftNav} from './leftnav/leftnav';
import {TopHeader} from './topheader/topheader';

let template = require('./app.html');
/*
 * App Component
 * Top Level Component
 */
@Component({
  // the selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'persice-app'
  selector: 'persice-app' // <persice-app></persice-app>
})
@View({
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, LeftNav, TopHeader],
  styles: [`
  `],
  template: template
})
export class App {

  constructor(public http: Http) {

  }

  onInit() {


  }


}
