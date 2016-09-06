import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FilterComponent } from '../../../../common/filter';
import { SliderComponent } from '../../../../common/slider';
import { FilterService } from '../../../../app/shared/services';
import { AppStateService } from '../../services';
import { SelectDirective } from '../../../../app/shared/directives';
import { NumeralPipe } from '../../../../app/shared/pipes';
import { KeywordsComponentMobile } from '../keywords/keywords-mobile.component';

@Component({
  selector: 'prs-mobile-filter',
  template: <any>require('./filter-mobile.html'),
  directives: [SelectDirective, SliderComponent, KeywordsComponentMobile],
  pipes: [NumeralPipe]
})
export class FilterMobileComponent extends FilterComponent implements OnInit, OnDestroy {
  // hide gender filter for now
  @Input() showGender: boolean = false;
  @Input() showAge = true;
  @Input() showDateRange: boolean = false;
  @Input() showHeaderOnBack: boolean = true;

  @Input() set type(value: string) {
    this.checkIfEvents(value);
  };

  @Output() onCloseFilters: EventEmitter<any> = new EventEmitter();

  filtersVisible: boolean = true;
  keywordsVisible: boolean = false;

  constructor(protected filterService: FilterService, public appStateService: AppStateService) {
    super(filterService);
  }

  ngOnInit() {
    document.querySelector('html').classList.toggle('bg-gray');
  }

  ngOnDestroy() {
    document.querySelector('html').classList.toggle('bg-gray');
  }

  save() {
    delete this.filters.state.keyword;
    let data = this.filters.state;
    if (data.distance >= this.rangeSliderOptionsDistance.max) {
      data.distance = this.rangeSliderOptionsDistance.unlimited;
    }

    this.filterService
      .updateOne(this.filters.state.resource_uri, data)
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
    this.onCloseFilters.emit({ data: ''});
    this._hideFiltersAndShowMainHeader();
  }

  public onGo() {
    this.onCloseFilters.emit({ data: ''});
    this._hideFiltersAndShowMainHeader();
    this.filterService.publishObservers();
  }

  private _hideFiltersAndShowMainHeader() {
    this.appStateService.setFilterVisibility(false);

    if (this.showHeaderOnBack) {
      this.appStateService.setHeaderVisibility(true);
    }
  }
}
