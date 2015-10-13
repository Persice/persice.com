/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef, NgFor, NgIf, NgClass} from 'angular2/angular2';


import {SearchResultsUserComponent} from '../searchresultsuser/searchresultsuser.component';
import {SearchResultsEventComponent} from '../searchresultsevent/searchresultsevent.component';
import {LoadingIndicatorComponent} from '../loadingindicator/loadingindicator.component';

let view = require('./searchresults.html');
@Component({
  selector: 'search-results',
  inputs: ['users', 'usersTotal', 'focus', 'events', 'eventsTotal', 'loadingUsers', 'loadingEvents', 'noResultsUsers', 'noResultsEvents']
})
@View({
  template: view,
  directives: [NgFor, NgIf, NgClass, SearchResultsUserComponent, SearchResultsEventComponent, LoadingIndicatorComponent]
})
export class SearchResultsComponent {
  constructor() {

  }
}
