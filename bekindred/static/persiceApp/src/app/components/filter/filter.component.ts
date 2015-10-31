/// <reference path='../../../typings/_custom.d.ts' />

import {
Component,
NgFor,
NgIf,
FORM_DIRECTIVES,
EventEmitter
} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS, RequestOptions} from 'angular2/http';
import {includes, findIndex, forEach, isUndefined} from 'lodash';

import {SelectComponent} from '../select/select.component';
import {RangeSliderComponent} from '../rangeslider/rangeslider.component';

import {FilterModel, InterfaceFilter} from '../../models/filter.model';


let view = require('./filter.html');

const defaultFilters: InterfaceFilter = {
  distance: 10000,
  distance_unit: 'miles',
  keyword: '',
  gender: 'm,f',
  min_age: '25',
  max_age: '60',
  order_criteria: 'match_score'
};

declare var jQuery: any;

@Component({
  selector: 'filters',
  outputs: ['refreshList'],
  directives: [FORM_DIRECTIVES, NgFor, NgIf, SelectComponent, RangeSliderComponent],
  template: view
})
export class FilterComponent {
  refreshList: EventEmitter = new EventEmitter();
  filters: FilterModel;
  gender: string = 'm,f';
  order: string = 'match_score';
  distanceValue: any = 10000;
  distanceUnit: string = 'miles';
  minAge: any = 25;
  maxAge: any = 60;
  keywords: Array<string> = [];
  keywordValue: string = '';
  keywordError: boolean = false;
  keywordErrorMessage: string = '';
  isFilterDisabled: boolean = true;
  renderSlider: boolean = false;
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
  rangeSliderOptionsAge = {
    hide_min_max: true,
    hide_from_to: true,
    keyboard: true,
    min: 18,
    max: 115,
    from: 25,
    to: 60,
    type: 'double',
    step: 1
  };
  rangeSliderOptionsDistance = {
    hide_min_max: true,
    hide_from_to: true,
    keyboard: true,
    min: 0,
    max: 10000,
    step: 1,
    from: 0,
    type: 'single'
  };

  constructor(public http: Http) {
    this.http.get('/api/v1/filter/state/?format=json')
      .map(res => res.json())
      .subscribe(data => this.setFilters(data));
  }

  onInit() {
    // set initial filters
    this.filters = new FilterModel(defaultFilters);
  }

  changeGender(value) {
    if (this.gender !== value) {
      this.gender = value;
      this.filters.state.gender = value;
      this.saveFilters(false);
    }

  }

  changeOrder(value) {
    if (this.order !== value) {
      this.order = value;
      this.filters.state.order_criteria = value;
      this.saveFilters(false);
    }
  }

  ageChanged(value) {
    this.minAge = value.from;
    this.maxAge = value.to;
  }

  saveAge(value) {
    this.filters.state.min_age = value.from;
    this.filters.state.max_age = value.to;
    this.saveFilters(false);
  }

  distanceChanged(value) {
    this.distanceValue = value.from;
  }

  saveDistance(value) {
    this.filters.state.distance = value.from;
    this.saveFilters(false);
  }

  setFilters(data) {
    this.filters = new FilterModel(data.objects[0]);
    this.gender = this.filters.state.gender;
    this.minAge = this.filters.state.min_age;
    this.maxAge = this.filters.state.max_age;
    this.rangeSliderOptionsAge.from = parseInt(this.minAge, 10);
    this.rangeSliderOptionsAge.to = parseInt(this.maxAge, 10);
    this.distanceValue = this.filters.state.distance;
    this.rangeSliderOptionsDistance.from = parseInt(this.distanceValue, 10);
    //trigger change for rerender Slider plugin
    this.renderSlider = !this.renderSlider;
    this.distanceUnit = this.filters.state.distance_unit;
    this.order = this.filters.state.order_criteria;
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
    //prevent saving keywords
    delete this.filters.state.keyword;
    this.http.patch(
      this.filters.state.resource_uri,
      JSON.stringify(this.filters.state),
      opts)
      .map(res => res.json())
      .subscribe(data => {
        this.isFilterDisabled = false;
        if (reset) {
          this.updateList();
        }
      });
  }


  addKeyword(event) {
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

  removeKeyword(index) {
    this.keywords.splice(index, 1);
    this.filters.state.keyword = this.keywords.join();
    this.saveFilters(false);
  }

  resetFilters(event) {

    //update view
    this.keywordError = false;
    this.gender = 'm,f';
    this.keywords = [];
    this.keywordValue = '';
    this.order = 'match_score';
    this.distanceValue = 10000;
    this.distanceUnit = 'miles';
    this.minAge = 25;
    this.maxAge = 60;
    this.rangeSliderOptionsAge.from = parseInt(this.minAge, 10);
    this.rangeSliderOptionsAge.to = parseInt(this.maxAge, 10);
    this.rangeSliderOptionsDistance.from = parseInt(this.distanceValue, 10);
    //trigger change for rerender Slider plugin
    this.renderSlider = !this.renderSlider;

    //update model
    this.filters.state.gender = 'm,f';
    this.filters.state.keyword = '';
    this.filters.state.order_criteria = 'match_score';
    this.orderBy = [
      {
        'label': 'Match Score',
        'value': 'match_score',
        'selected': true
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

    this.filters.state.distance = 10000;
    this.filters.state.distance_unit = 'miles';
    this.filters.state.min_age = '25';
    this.filters.state.max_age = '60';

    //update filters in backend and refresh crowd list
    this.saveFilters(true);


  }

  updateList() {
    if (!this.isFilterDisabled) {
      this.keywordError = false;
      this.refreshList.next(true);
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
