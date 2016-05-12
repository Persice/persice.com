import {Component, Input} from '@angular/core';
import {FilterComponent} from '../../../../common/filter';
import {SliderComponent} from '../../../../common/slider';
import {FilterService} from '../../../../app/shared/services';
import {AppStateService} from '../../services';
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
  @Input() showGender = true;
  @Input() set type(value: string) {
    this.addOrderByForEventsFilter(value);
  };

  filtersVisible: boolean = true;
  keywordsVisible: boolean = false;

  constructor(protected filterService: FilterService, public appStateService: AppStateService) {
    super(filterService);
  }

  save() {
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
    this._hideFiltersAndShowMainHeader();
  }

  public onGo() {
    this._hideFiltersAndShowMainHeader();
    this.filterService.publishObservers();
  }

  private _hideFiltersAndShowMainHeader() {
    this.appStateService.setFilterVisibility(false);
    this.appStateService.setHeaderVisibility(true);
  }
}
