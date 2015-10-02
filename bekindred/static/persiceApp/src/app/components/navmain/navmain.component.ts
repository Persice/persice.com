/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

let view = require('./navmain.html');
@Component({
  selector: 'nav-main'
})
@View({
  template: view
})
export class NavMainComponent {
  constructor() {

  }
}
