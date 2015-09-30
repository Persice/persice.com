/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

import {SearchResults} from '../searchresults/searchresults';
import {SearchInput} from '../searchinput/searchinput';

let view = require('./search.html');
@Component({
  selector: 'search'
})
@View({
  directives: [SearchInput, SearchResults],
  template: view
})
export class Search {
  constructor() {

  }
}
