/// <reference path='../../../typings/_custom.d.ts' />

import {
  Component,
  View,
  Directive,
  ElementRef,
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  AbstractControl,
  NgFor,
  NgIf,
  EventEmitter
} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS, RequestOptions} from 'angular2/http';
import {includes, findIndex, forEach, isUndefined} from 'lodash';

import {SelectComponent} from '../select/select.component';

import {FilterModel} from '../../models/filter.model';

let view = require('./filter.html');

declare var jQuery: any;

@Component({
  selector: 'filter',
  inputs: ['state'],
  outputs: ['refreshCrowd'],
  directives: [FORM_DIRECTIVES, NgFor, NgIf, SelectComponent],
  template: view
})
export class FilterComponent {
  refreshCrowd: EventEmitter = new EventEmitter();
  filters: FilterModel;
  filterForm: ControlGroup;
  gender: string = 'm,f';
  order: String = 'match_score';
  distanceValue: Number = 10000;
  distanceUnit: String = 'miles';
  minAge: Number = 25;
  maxAge: Number = 60;
  keywords: Array<string> = [];
  keywordValue: string = '';
  keywordError: boolean = false;
  keywordErrorMessage: string = '';
  isFilterDisabled: boolean = true;
  orderBy: Array<Object> = [
    {
      'label': 'Match Score',
      'value': 'match_score',
      'selected': false
    },
    {
      'label': 'Distance',
      'value': 'distance',
      'selected': false
    },
    {
      'label': 'Mutual Friends',
      'value': 'mutual_friends',
      'selected': false
    }
  ];

  constructor(public http: Http, fb: FormBuilder) {
    this.http.get('/api/v1/filter/state/?format=json')
      .map(res => res.json())
      .subscribe(data => this.setFilters(data));
  }

  changeGender(value) {
    if (this.gender !== value) {
      this.gender = value;
      this.filters.state.gender = value;
      this.saveFilters(false);
    }

  }

  setFilters(data) {
    this.filters = new FilterModel(data.objects[0]);
    this.gender = this.filters.state.gender;
    if (this.filters.state.keyword.length > 0) {
      this.keywords = this.filters.state.keyword.split(',');
    }

    let index = findIndex(this.orderBy, (option) => {
      return option['value'] === this.filters.state.order_criteria;
    });

    if (!isUndefined(index)) {
      this.orderBy[index]['selected'] = true;
    }
    else {
      //set match score as default selected option
      this.orderBy[0]['selected'] = true;
    }



  }

  saveFilters(reset) {
    let headers: Headers = new Headers();
    let csrftoken = this.getCookieValue('csrftoken');
    headers.append('X-CSRFToken', csrftoken);
    headers.append('Content-Type', 'application/json');

    let opts: RequestOptions = new RequestOptions();
    opts.headers = headers;

    this.http.patch(
      this.filters.state.resource_uri,
        JSON.stringify(this.filters.state),
        opts)
      .map(res => res.json())
      .subscribe(data => {
      this.isFilterDisabled = false;
      if (reset) {
        this.updateCrowdList();
      }
    });
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

        let keywordsTemp = this.keywords;
        keywordsTemp.push(this.keywordValue);

        if (keywordsTemp.join().length < 50) {
          this.keywordError = false;
          this.keywordErrorMessage = '';
          this.filters.state.keyword = this.keywords.join();
          this.saveFilters(false);
          this.keywordValue = '';
        }
        else {
          this.keywordError = true;
          this.keywordErrorMessage = 'You cannot enter more keywords.';
        }

      }

    }
  }

  removeKeyword(index) {
    this.keywords.splice(index, 1);
    this.filters.state.keyword = this.keywords.join();
    this.saveFilters(false);
  }

  resetFilters(event) {

    //update view
    this.gender = 'm,f';
    this.keywords = [];
    this.keywordValue = '';
    this.order = 'match_score';
    this.distanceValue = 10000;
    this.distanceUnit = 'miles';
    this.minAge = 25;
    this.maxAge = 60;

    //update model
    this.filters.state.gender = 'm,f';
    this.filters.state.keyword = '';
    this.filters.state.order_criteria = 'match_score';
    this.filters.state.distance = 10000;
    this.filters.state.distance_unit = 'miles';
    this.filters.state.min_age = '25';
    this.filters.state.max_age = '60';

    //update filters in backend and refresh crowd list
    this.saveFilters(true);


  }

  updateCrowdList() {
    if (!this.isFilterDisabled) {
      this.refreshCrowd.next(true);
      this.isFilterDisabled = true;
      // jQuery('html, body').animate({ scrollTop: 0 }, 'slow');
    }

  }

  private getCookieValue(name) {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

}
