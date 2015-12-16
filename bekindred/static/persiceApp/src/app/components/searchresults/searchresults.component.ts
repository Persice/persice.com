import {Component} from 'angular2/core';


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
    SearchResultsUserComponent,
    SearchResultsEventComponent,
    LoadingComponent
  ]
})
export class SearchResultsComponent {
}
