import { Component, Input } from '@angular/core';
import { FilterComponent } from '../../../common/filter/filter.component';
import { FilterService } from '../../../common/services/filter.service';

@Component({
  selector: 'prs-filters',
  templateUrl: 'filter-desktop.html'
})
export class FilterDesktopComponent extends FilterComponent {
  @Input() set type(value: string) {
    this.checkIfEvents(value);
  };

  constructor(protected filterService: FilterService) {
    super(filterService);
  }
}
