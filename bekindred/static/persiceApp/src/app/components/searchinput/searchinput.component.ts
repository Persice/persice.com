import {Component, EventEmitter} from 'angular2/core';
import {Http} from 'angular2/http';

import {SearchService} from '../../services/search.service';
import {SearchResultUserModel} from '../../models/searchresults.model';
import {SearchResultEventModel} from '../../models/searchresults.model';

let view = require('./searchinput.html');

@Component({
  selector: 'search-input',
  outputs: [
    'loadingUsers',
    'resultsUsers',
    'reset',
    'loadingEvents',
    'resultsEvents',
    'totalUsers',
    'totalEvents',
    'focusedInput'
  ],
  template: view
})
export class SearchInputComponent {
  reset: EventEmitter<any> = new EventEmitter();
  loadingUsers: EventEmitter<any> = new EventEmitter();
  focusedInput: EventEmitter<any> = new EventEmitter();
  loadingEvents: EventEmitter<any> = new EventEmitter();
  resultsUsers: EventEmitter<any> = new EventEmitter();
  resultsEvents: EventEmitter<any> = new EventEmitter();
  totalEvents: EventEmitter<any> = new EventEmitter();
  totalUsers: EventEmitter<any> = new EventEmitter();
  timeoutId: number;

  constructor(public service: SearchService, public http: Http) {

  }

  inputChanged($event, query): void {

    if (!query || query.length < 2) {
      this.reset.next(true);
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      return;
    }


    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(
      () => {
        this.loadingUsers.next(true);
        this.service.search(query, 'user')
          .subscribe(data => this.assignDataUsers(data));

        this.loadingEvents.next(true);
        this.service.search(query, 'event')
          .subscribe(data => this.assignDataEvents(data));
      },
      700
    );
  }

  assignDataUsers(data) {
    this.loadingUsers.next(false);
    let resultsUsers = data.objects.map(item => {
      return new SearchResultUserModel(item);
    });

    if (resultsUsers.length === 0) {
      this.resultsUsers.next(null);
      this.totalUsers.next(0);
      return;
    }
    else {
      this.resultsUsers.next(resultsUsers);
      this.totalUsers.next(resultsUsers.length);
    }


  }

  assignDataEvents(data) {
    this.loadingEvents.next(false);
    let resultsEvents = data.objects.map(item => {
      return new SearchResultEventModel(item);
    });
    if (resultsEvents.length === 0) {
      this.resultsEvents.next(null);
      this.totalEvents.next(0);
      return;
    }
    else {
      this.resultsEvents.next(resultsEvents);
      this.totalEvents.next(resultsEvents.length);
    }


  }

  focusOut($event) {
    this.focusedInput.next(false);
  }

  focusIn($event) {
    this.focusedInput.next(true);
  }



}
