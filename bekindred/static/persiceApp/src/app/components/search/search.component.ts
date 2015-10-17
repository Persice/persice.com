/// <reference path="../../../typings/_custom.d.ts" />

import {Component, CORE_DIRECTIVES} from 'angular2/angular2';

import {SearchResultsComponent} from '../searchresults/searchresults.component';
import {SearchInputComponent} from '../searchinput/searchinput.component';

import {SearchResultUserModel} from '../../models/searchresults.model';
import {SearchResultEventModel} from '../../models/searchresults.model';

let view = require('./search.html');
@Component({
  selector: 'search',
  directives: [CORE_DIRECTIVES, SearchInputComponent, SearchResultsComponent],
  template: view
})
export class SearchComponent {
  focusinput: boolean = false;
  resultsUsers: SearchResultUserModel[];
  resultsUsersTotalCount: number;
  resultsEvents: SearchResultEventModel[];
  resultsEventsTotalCount: number;
  loadingUsers: boolean = false;
  loadingEvents: boolean = false;
  noResEvents = false;
  noResUsers = false;
  constructor() {
  }

  updateResultsUsers(results: SearchResultUserModel[]): void {
    this.resultsUsers = results;
  }

  updateResultsEvents(results: SearchResultEventModel[]): void {
    this.resultsEvents = results;
  }

  reset(): void {
    this.noResUsers = false;
    this.noResEvents = false;
    this.resultsUsers = null;
    this.resultsEvents = null;
    this.loadingUsers = false;
    this.loadingEvents = false;
    this.resultsEventsTotalCount = 0;
    this.resultsUsersTotalCount = 0;
  }

  updateResultsUsersTotalCount(count: number): void {
    this.resultsUsersTotalCount = count;
    if (count === 0) {
      this.noResUsers = true;
    }
    else {
      this.noResUsers = false;
    }
  }

  updateResultsEventsTotalCount(count: number): void {
    this.resultsEventsTotalCount = count;
    if (count === 0) {
      this.noResEvents = true;
    }
    else {
      this.noResEvents = false;
    }
  }

}
