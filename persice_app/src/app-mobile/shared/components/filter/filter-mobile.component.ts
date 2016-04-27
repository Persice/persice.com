import {
  Component,
  Input
} from 'angular2/core';

import {findIndex, isUndefined, debounce, throttle} from 'lodash';

import {FilterModel, InterfaceFilter} from '../../../../app/shared/models';

import {FilterComponent} from '../../../../common/filter';
import {SliderComponent} from '../../../../common/slider';
import {FilterService} from '../../../../app/shared/services';

import {SelectDirective} from '../../../../app/shared/directives';
import {NumeralPipe} from '../../../../app/shared/pipes';
import {KeywordsComponentMobile} from "../keywords/keywords-mobile.component";

@Component({
  selector: 'prs-mobile-filter',
  template: require('./filter-mobile.html'),
  directives: [SelectDirective, SliderComponent, KeywordsComponentMobile],
  pipes: [NumeralPipe]
})
export class FilterMobileComponent extends FilterComponent {
  filtersVisible: boolean = true;
  keywordsVisible: boolean = false;

  constructor(protected filterService: FilterService) {
    super(filterService);
  }

  save() {
    //prevent saving keywords (TODO: probably need to remove it after implemented keywords)
    delete this.filters.state.keyword;
    this.filterService
      .updateOne(this.filters.state.resource_uri, this.filters.state)
      .subscribe();
  }

  public activateTab(type) {
    switch (type) {
      case 'filters':
        this.filtersVisible = true;
        this.keywordsVisible = false;
        break;
      case 'keywords':
        this.filtersVisible = false;
        this.keywordsVisible = true;
        break;
      default:
        break;
    }
  }

  public onBack() {
    this.filterService.setVisibility(false);
  }

  public onGo() {
    this.filterService.setVisibility(false);
    this.filterService.publishObservers();
  }
}
