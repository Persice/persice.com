/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

import {SearchResultsComponent} from '../searchresults/searchresults.component';
import {SearchInputComponent} from '../searchinput/searchinput.component';

let view = require('./search.html');
@Component({
  selector: 'search'
})
@View({
  directives: [SearchInputComponent, SearchResultsComponent],
  template: view
})
export class SearchComponent {
  constructor() {

  }
}
