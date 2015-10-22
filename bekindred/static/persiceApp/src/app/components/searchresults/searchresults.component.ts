/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgFor, NgIf, NgClass} from 'angular2/angular2';


import {SearchResultsUserComponent} from '../searchresultsuser/searchresultsuser.component';
import {SearchResultsEventComponent} from '../searchresultsevent/searchresultsevent.component';
import {LoadingComponent} from '../loading/loading.component';

let view = require('./searchresults.html');
@Component({
  selector: 'search-results',
  inputs: [
    'users',
    'usersTotal',
    'focus',
    'events',
    'eventsTotal',
    'loadingUsers',
    'loadingEvents',
    'noResultsUsers',
    'noResultsEvents'
  ],
  template: view,
  directives: [
    NgFor,
    NgIf,
    NgClass,
    SearchResultsUserComponent,
    SearchResultsEventComponent,
    LoadingComponent
  ]
})
export class SearchResultsComponent {
  constructor() {

  }
}
