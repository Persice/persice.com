/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef, CORE_DIRECTIVES} from 'angular2/angular2';

import {SearchResultsComponent} from '../searchresults/searchresults.component';
import {SearchInputComponent} from '../searchinput/searchinput.component';

import {SearchResultUserModel} from '../../models/searchresults.model';
import {SearchResultEventModel} from '../../models/searchresults.model';

let view = require('./search.html');
@Component({
  selector: 'search'
})
@View({
  directives: [CORE_DIRECTIVES, SearchInputComponent, SearchResultsComponent],
  template: view
})
export class SearchComponent {
  focusinput: boolean = false;
  resultsUsers: SearchResultUserModel[];
  resultsUsersTotalCount: number = 0;
  resultsEvents: SearchResultEventModel[];
  resultsEventsTotalCount: number = 0;
  loadingUsers: boolean = false;
  loadingEvents: boolean = false;
  constructor() {
  }

  updateResultsUsers(results): void {
    this.resultsUsers = results;
  }

  updateResultsEvents(results: SearchResultEventModel[]): void {
    this.resultsEvents = results;
  }

  updateResultsUsersTotalCount(count: number): void {
    this.resultsUsersTotalCount = count;
  }

  updateResultsEventsTotalCount(count: number): void {
    this.resultsEventsTotalCount = count;
  }

}
