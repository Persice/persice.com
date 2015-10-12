/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef, NgIf} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';

import {UsersListComponent} from '../userslist/userslist.component';
import {LoadingIndicatorComponent} from '../loadingindicator/loadingindicator.component';
import {FilterComponent} from '../filter/filter.component';
import {FilterModel, InterfaceFilter} from '../../models/filter.model';

let view = require('./crowdpage.html');

const defaultFilters: InterfaceFilter = {
  distance: 10000,
  distance_unit: 'miles',
  keyword: '',
  gender: 'm,f',
  min_age: '25',
  max_age: '60',
  order_criteria: 'match_score'
};



@Component({
  selector: 'crowd-page'
})
@View({
  template: view,
  directives: [NgIf, FilterComponent, UsersListComponent, LoadingIndicatorComponent]
})
export class CrowdPageComponent {
  crowd: Array<any>;
  filters: FilterModel;
  loading: boolean;
  isListEmpty: boolean;
  constructor(public http: Http) {

  }

  onInit() {
    // set initial filters for Crowd page
    this.filters = new FilterModel(defaultFilters);

    this.isListEmpty = false;
    this.loading = true;

    // Crowd page load users list
    this.http.get('/api/v1/matchfeed2/?format=json&filter=true')
    .map(res => res.json())
    .subscribe(data => this.assignCrowd(data));
  }

  assignCrowd(data) {
    this.loading = false;
    this.crowd = data.objects;
    if (this.crowd.length === 0 ) {
      this.isListEmpty = true;
    } else {
      this.isListEmpty = false;
    }



  }
}
