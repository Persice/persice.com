import {findIndex, debounce} from 'lodash';

import {FilterModel, InterfaceFilter} from '../../app/shared/models';
import {FilterService} from '../../app/shared/services';

export abstract class FilterComponent {
  showAge: boolean = true;
  showGender: boolean = true;
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

  constructor(protected filterService: FilterService) {
    this.saveDebounced = debounce(this.save, 500, { 'leading': true, 'trailing': true });

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

  changeGender(value) {
    if (this.gender !== value) {
      this.gender = value;
      this.filters.state.gender = value;
      this.saveDebounced();
    }
  }

  changeOrder(value) {
    let index = findIndex(this.orderBy, (option) => {
      return option['value'].toLowerCase() === value.toLowerCase();
    });

    if (this.order !== value) {
      this.order = value;
      this.filters.state.order_criteria = this.orderBy[index]['value'];
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
      return option['value'] === this.filters.state.order_criteria.toLowerCase();
    });

    if (index !== -1) {
      this.orderBy[index]['selected'] = true;
    } else {
      //set match score as default selected option
      this.orderBy[0]['selected'] = true;
    }

  }

  save() {
    //prevent saving keywords
    delete this.filters.state.keyword;
    this.filterService
      .updateOne(this.filters.state.resource_uri, this.filters.state)
      .subscribe(res => {
        this.filterService.publishObservers();
      });
  }

  checkIfEvents(value: string): void {
    if (value === 'events') {
      this.showAge = false;
      this.showGender = false;
      this.orderBy = [...this.orderBy, {
        'label': 'Event score',
        'value': 'event_score',
        'selected': false
      }];
    } else {
      this.orderBy[2]['label'] = 'Recently Active';
    }
  }


}
