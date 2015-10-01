/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

let view = require('./filter.html');

@Component({
  selector: 'filter'
})
@View({
  directives: [],
  template: view
})
export class FilterComponent {
  constructor() {

  }
}
