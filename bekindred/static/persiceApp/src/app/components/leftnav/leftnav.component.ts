/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

import {LogoComponent} from '../logo/logo.component';
let view = require('./leftnav.html');
@Component({
  selector: 'left-nav'
})
@View({
  directives: [LogoComponent],
  template: view
})
export class LeftNavComponent {
  constructor() {

  }
}
