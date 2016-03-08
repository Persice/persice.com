import {Component, Input} from 'angular2/core';
import {findIndex, isUndefined, debounce, throttle} from 'lodash';

import {SelectDirective} from '../../directives/select.directive';
import {RangeSliderComponent} from '../rangeslider/rangeslider.component';
import {NumeralPipe} from '../../pipes/numeral.pipe';

import {FilterModel, InterfaceFilter} from '../../models/filter.model';
import {FilterService} from '../../services/filter.service';


let view = require('./filter.html');

declare var jQuery: any;

@Component({
  selector: 'filters',
  directives: [
  SelectDirective,
  RangeSliderComponent
  ],
  pipes: [NumeralPipe],
  template: view
})
export class FilterComponent {
  @Input() showGender = true;
  @Input() type;
  filters: FilterModel;
  defaultState: InterfaceFilter;
  gender: string = 'm,f';
  order: string = 'match_score';
  distanceValue: any = 10000;
  distanceUnit: string = 'miles';
  minAge: any = 25;
  maxAge: any = 60;
  renderSlider: boolean = false;
  orderBy: Array<Object> = [
  {
    'label': 'Similarity',
    'value': 'match_score',
    'selected': false
  },
  {
    'label': 'Distance',
    'value': 'distance',
    'selected': false
  },
  {
    'label': 'Date',
    'value': 'date',
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
  saveDebounced: Function;

  timeoutIdFiltersSave = null;

  constructor(
    public filterService: FilterService
    ) {
    this.saveDebounced = debounce(this.save, 1500, {'leading': true, 'trailing': true });
    this.filterService.find()
    .subscribe(data => this.setFilters(data),
      (err) => {
        console.log(err);
      },
      () => {

      });
    this.defaultState = this.filterService.getDefaultState();
    this.filters = new FilterModel(this.defaultState);
  }

  ngOnInit() {
    //change date label if page is crowd or connections
    if (this.type === 'crowd' || this.type === 'connections') {
      this.orderBy[2]['label'] = 'Recently Active';
    }
  }

  changeGender(value) {
    if (this.gender !== value) {
      this.gender = value;
      this.filters.state.gender = value;
      this.saveDebounced();
    }

  }

  changeOrder(value) {
    if (this.order !== value) {
      this.order = value;
      this.filters.state.order_criteria = value;
      this.saveDebounced();
    }
  }

  ageChanged(value) {
    this.minAge = value.from;
    this.maxAge = value.to;
  }

  saveAge(value) {
    this.filters.state.min_age = value.from;
    this.filters.state.max_age = value.to;
    this.saveDebounced();
  }

  distanceChanged(value) {
    this.distanceValue = value.from;
  }

  saveDistance(value) {
    this.filters.state.distance = value.from;
    this.saveDebounced();
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

  save() {


    let data = this.filters.state;
    //prevent saving keywords
    delete data.keyword;

    let resourceUri = this.filters.state.resource_uri;

    this.filterService.updateOne(resourceUri, data)
    .subscribe(res => {
       this.filterService.publishObservers();
    });


  }


}