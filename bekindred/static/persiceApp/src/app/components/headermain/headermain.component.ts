/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

import {NavMainComponent} from '../navmain/navmain.component';
import {LogoComponent} from '../logo/logo.component';

let view = require('./headermain.html');
@Component({
  selector: 'header-main'
})
@View({
  directives: [NavMainComponent, LogoComponent],
  template: view
})
export class HeaderMainComponent {
  constructor() {
  }
}