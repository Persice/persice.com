/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

let view = require('./searchinput.html');
@Component({
  selector: 'search-input'
})
@View({
  template: view
})
export class SearchInput {
  constructor() {

  }
}
