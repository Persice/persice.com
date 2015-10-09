/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef, EventEmitter, OnInit} from 'angular2/angular2';
import * as Rx from 'rx';

import {SearchService} from '../../services/search.service';
import {SearchResultUserModel} from '../../models/searchresults.model';
import {SearchResultEventModel} from '../../models/searchresults.model';

let view = require('./searchinput.html');
@Component({
  selector: 'search-input',
  outputs: ['loadingUsers', 'resultsUsers', 'loadingEvents', 'resultsEvents', 'totalUsers', 'totalEvents']
})
@View({
  template: view
})
export class SearchInputComponent {
  loadingUsers: EventEmitter = new EventEmitter();
  loadingEvents: EventEmitter = new EventEmitter();
  resultsUsers: EventEmitter = new EventEmitter();
  resultsEvents: EventEmitter = new EventEmitter();
  totalEvents: EventEmitter = new EventEmitter();
  totalUsers: EventEmitter = new EventEmitter();
  timeoutId: number;

  constructor(public service: SearchService, private el: ElementRef) {

  }

  inputChanged($eventm, query): void {

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.loadingUsers.next(true);
      this.service.searchUsers(query)
      .subscribe(
        (results: SearchResultUserModel[]) => { // on sucesss
          this.loadingUsers.next(false);
          this.resultsUsers.next(results);
          this.totalUsers.next(results.length);
        },
       (err: any) => { // on error
         console.log(err);
         this.loadingUsers.next(false);
       },
       () => { // on completion
         this.loadingUsers.next(false);
       }
       );

      this.service.searchEvents(query)
      .subscribe(
        (results: SearchResultEventModel[]) => { // on sucesss
          this.loadingEvents.next(false);
          this.resultsEvents.next(results);
          this.totalEvents.next(results.length);
        },
       (err: any) => { // on error
         console.log(err);
         this.loadingEvents.next(false);
       },
       () => { // on completion
         this.loadingEvents.next(false);
       }
       );
    }, 250);


  }

}
