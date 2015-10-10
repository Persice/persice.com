/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive} from 'angular2/angular2';

import {SearchResultEventModel} from '../../models/searchresults.model';
import {ImageStretchDirective} from '../../directives/imagestretch.directive';

let view = require('./searchresultsevent.html');

@Component({
  inputs: ['event'],
  selector: 'searchresult-event'
})
@View({
  template: view,
  directives: [ImageStretchDirective]
})
export class SearchResultsEventComponent {
  event: SearchResultEventModel;
  constructor() {

  }
}