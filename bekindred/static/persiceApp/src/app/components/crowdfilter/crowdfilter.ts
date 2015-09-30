/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

let view = require('./crowdfilter.html');
@Component({
  selector: 'crowd-filter'
})
@View({
  directives: [],
  template: view
})
export class CrowdFilter {
  constructor() {

  }
}
