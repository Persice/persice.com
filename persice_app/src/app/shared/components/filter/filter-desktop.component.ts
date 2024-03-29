import { Component, Input } from '@angular/core';
import { FilterComponent } from '../../../../common/filter';
import { SliderComponent } from '../../../../common/slider';
import { SelectDirective } from '../../directives';
import { NumeralPipe } from '../../pipes';
import { FilterService } from '../../services';
import { DatepickerDirective } from '../../directives/datepicker.directive';

@Component({
  selector: 'prs-filters',
  directives: [SelectDirective, SliderComponent, DatepickerDirective],
  pipes: [NumeralPipe],
  template: <any>require('./filter-desktop.html')
})
export class FilterDesktopComponent extends FilterComponent {
  @Input() set type(value: string) {
    this.checkIfEvents(value);
  };

  constructor(protected filterService: FilterService) {
    super(filterService);
  }
}
