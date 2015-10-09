/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive} from 'angular2/angular2';

import {SearchResultEventModel} from '../../models/searchresults.model';

let view = require('./searchresultsevent.html');

@Component({
  inputs: ['event'],
  selector: 'searchresult-event'
})
@View({
  template: view
})
export class SearchResultsEventComponent {
  event: SearchResultEventModel;
  constructor() {

  }
}
