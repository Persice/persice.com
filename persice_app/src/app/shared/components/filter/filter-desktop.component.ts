import {Component} from '@angular/core';
import {FilterComponent} from '../../../../common/filter';
import {SliderComponent} from '../../../../common/slider';

import {SelectDirective} from '../../directives';
import {NumeralPipe} from '../../pipes';
import {FilterService} from '../../services';

@Component({
  selector: 'prs-filters',
  directives: [SelectDirective, SliderComponent],
  pipes: [NumeralPipe],
  template: require('./filter-desktop.html')
})
export class FilterDesktopComponent extends FilterComponent {
  constructor(protected filterService: FilterService) {
    super(filterService);
  }
}
