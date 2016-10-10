import { findIndex, debounce } from 'lodash';
import { DateUtil } from '../core/util';
import { FilterModel, InterfaceFilter } from '../models/filter/filter.model';
import { FilterService } from '../services/filter.service';

export abstract class FilterComponent {
  showAge: boolean = true;
  // hide gender filter for now
  showGender: boolean = false;
  showDateRange: boolean = false;
  filters: FilterModel;
  defaultState: InterfaceFilter;
  gender: string = 'm,f';
  order: string = 'match_score';
  distanceValue: any = 201;
  distanceUnit: string = 'miles';
  minAge: any = 25;
  maxAge: any = 60;
  renderSlider: boolean = false;
  orderBy: Array<Object> = [
    {
      'label': 'Attendee Similarity',
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
      'label': 'Network Connections',
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
    min: 1,
    max: 201,
    unlimited: 10000,
    step: 1,
    from: 0,
    type: 'single',
    max_value_display_name: 'Anywhere'
  };
  saveDebounced: Function;

  START_DATE_ISO = DateUtil.format(DateUtil.todayRoundUp(), 'YYYY-MM-DD');
  START_DATE_MS = DateUtil.todayRoundUp().unix() * 1000;
  END_DATE_MS = DateUtil.nextMonth().unix() * 1000;

  selectedStartDate = this.START_DATE_ISO;
  selectedEndDate = null;

  timeoutIdFiltersSave = null;

  constructor(protected filterService: FilterService) {
    this.saveDebounced = debounce(this.save, 500, { 'leading': true, 'trailing': true });

    this.filterService.find()
      .subscribe(data => this.setFilters(data));
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
      return option[ 'value' ].toLowerCase() === value.toLowerCase();
    });

    if (this.order !== value) {
      this.order = value;
      this.filters.state.order_criteria = this.orderBy[ index ][ 'value' ];
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

  startDateChanged(data: any) {
    this.selectedStartDate = data;
  }

  endDateChanged(data: any) {
    this.selectedEndDate = data;
  }

  saveDistance(value) {
    this.filters.state.distance = value.from;

    if (this.filters.state.distance >= this.rangeSliderOptionsDistance.max) {
      this.filters.state.distance = this.rangeSliderOptionsDistance.unlimited;
    }

    this.saveDebounced();
  }

  setFilters(data) {
    this.filters = new FilterModel(data.objects[ 0 ]);
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
      return option[ 'value' ] === this.filters.state.order_criteria.toLowerCase();
    });

    if (index !== -1) {
      this.orderBy[ index ][ 'selected' ] = true;
    } else {
      //set match score as default selected option
      this.orderBy[ 0 ][ 'selected' ] = true;
    }

  }

  save() {
    //prevent saving keywords
    delete this.filters.state.keyword;
    this.filterService
      .updateOne(this.filters.state.resource_uri, this.filters.state)
      .subscribe(res => {
        this.filterService.publishObservers();
      }, (err) => { });
  }

  checkIfEvents(value: string): void {
    if (value === 'events') {
      this.showAge = false;
      this.showGender = false;
      this.showDateRange = true;
      this.orderBy = [ ...this.orderBy, {
        'label': 'My Interests',
        'value': 'event_score',
        'selected': false
      } ];
    } else {
      this.orderBy[ 2 ][ 'label' ] = 'Recently Active';
      this.orderBy[ 0 ][ 'label' ] = 'Similarity';
    }
  }

}
