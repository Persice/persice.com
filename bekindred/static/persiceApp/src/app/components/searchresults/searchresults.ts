/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

let view = require('./searchresults.html');
@Component({
  selector: 'search-results'
})
@View({
  directives: [SearchResults],
  template: view
})
export class SearchResults {
  constructor() {

  }
}
