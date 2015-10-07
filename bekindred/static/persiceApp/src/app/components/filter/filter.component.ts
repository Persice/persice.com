/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';


import {FilterModel} from '../../models/filter.model';

let view = require('./filter.html');

@Component({
  selector: 'filter',
  inputs: ['state']
})
@View({
  directives: [],
  template: view
})
export class FilterComponent {
  state: FilterModel;
  constructor(public http: Http) {
    console.log('Filter Component');
    this.http.get('/api/v1/filter/state/?format=json')
      .map(res => res.json())
      .subscribe(data => this.assignCrowdFilter(data));


  }

  assignCrowdFilter(data) {
    this.state = new FilterModel(data.objects[0]);
    console.log(this.state);
  }
}
