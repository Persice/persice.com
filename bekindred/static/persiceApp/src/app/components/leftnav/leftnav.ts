/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

import {Logo} from '../logo/logo';
let view = require('./leftnav.html');
@Component({
  selector: 'left-nav'
})
@View({
  directives: [Logo],
  template: view
})
export class LeftNav {
  constructor() {

  }
}
