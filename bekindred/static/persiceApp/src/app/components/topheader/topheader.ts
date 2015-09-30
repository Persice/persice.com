/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

import {Search} from '../search/search';
let view = require('./topheader.html');
@Component({
  selector: 'top-header'
})
@View({
  directives: [Search],
  template: view
})
export class TopHeader {
  constructor() {

  }
}
