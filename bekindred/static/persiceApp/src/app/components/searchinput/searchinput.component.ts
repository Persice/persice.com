/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef, EventEmitter, OnInit} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';
import * as Rx from 'rx';

import {SearchService} from '../../services/search.service';
import {SearchResultUserModel} from '../../models/searchresults.model';
import {SearchResultEventModel} from '../../models/searchresults.model';

let view = require('./searchinput.html');
let API_URL_USER: string = '/api/v1/auth/user/search/';

@Component({
  selector: 'search-input',
  outputs: ['loadingUsers', 'resultsUsers', 'loadingEvents', 'resultsEvents', 'totalUsers', 'totalEvents', 'focusedInput']
})
@View({
  template: view
})
export class SearchInputComponent {
  loadingUsers: EventEmitter = new EventEmitter();
  focusedInput: EventEmitter = new EventEmitter();
  loadingEvents: EventEmitter = new EventEmitter();
  resultsUsers: EventEmitter = new EventEmitter();
  resultsEvents: EventEmitter = new EventEmitter();
  totalEvents: EventEmitter = new EventEmitter();
  totalUsers: EventEmitter = new EventEmitter();
  timeoutId: number;

  constructor(public service: SearchService, private el: ElementRef, public http: Http) {

  }

  inputChanged($event, query): void {


    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {

      this.service.search(query, 'user')
        .do(() => this.loadingUsers.next(true))
        .map(res => res.json())
        .subscribe(data => this.assignDataUsers(data));

      this.service.search(query, 'event')
        .do(() => this.loadingEvents.next(true))
        .map(res => res.json())
        .subscribe(data => this.assignDataEvents(data));
    }, 500);
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
