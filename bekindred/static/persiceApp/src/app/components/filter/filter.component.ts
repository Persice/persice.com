/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef, FORM_DIRECTIVES, FormBuilder, ControlGroup, AbstractControl, NgFor, NgIf} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';
import {includes} from 'lodash';

import {FilterModel} from '../../models/filter.model';

let view = require('./filter.html');

@Component({
  selector: 'filter',
  inputs: ['state'],
  directives: [FORM_DIRECTIVES, NgFor, NgIf],
  template: view
})
export class FilterComponent {
  filters: FilterModel;
  filterForm: ControlGroup;
  gender: string = 'm,f';
  order: String ='match_score';
  distanceValue: Number = 10000;
  distanceUnit: String = 'miles';
  minAge: Number = 25;
  maxAge: Number = 60;
  keywords: Array<string> = [];
  keywordValue: string = '';
  keywordError: boolean = false;
  keywordErrorMessage: string = '';

  constructor(public http: Http, fb: FormBuilder) {
    this.http.get('/api/v1/filter/state/?format=json')
    .map(res => res.json())
    .subscribe(data => this.assignCrowdFilter(data));

  }

  assignCrowdFilter(data) {
    this.filters = new FilterModel(data.objects[0]);
    console.log(this.filters.state);
    this.gender = this.filters.state.gender;
    this.keywords = this.filters.state.keyword.split(',');
  }


  addKeyword(event) {
    // add keyword on key enter,
    if (event.keyCode === 13) {
      //check string length
      if (this.keywordValue.length < 3) {
        this.keywordError = true;
        this.keywordErrorMessage = 'Keyword must have at least 3 letters.';
        return;
      }
      //prevent duplicate entry
      if (includes(this.keywords, this.keywordValue)) {
        this.keywordError = true;
        this.keywordErrorMessage = 'Keyword already exists';
      }
      else {
        this.keywordError = false;
        this.keywords.push(this.keywordValue);
        this.keywordValue = '';
      }

    }
  }

  removeKeyword(index) {
    this.keywords.splice(index, 1);
  }

}
