import { ListComponent } from '../list';
import { CrowdService } from './crowd.service';
import { FilterService } from '../services/filter.service';

export class CrowdComponent extends ListComponent {
  static LIST_TYPE: string = 'crowd';
  static LIST_LIMIT: number = 12;

  constructor(
    protected listService: CrowdService,
    protected filterService: FilterService,
    protected listRefreshTimeout: number
  ) {
    super(listService, CrowdComponent.LIST_TYPE, CrowdComponent.LIST_LIMIT, 'username', listRefreshTimeout);
  }

  subscribeToFilterServiceUpdates() {

    // Add observer for filter updates
    this.filterService.addObserver(CrowdComponent.LIST_TYPE);

    // When filter updates, automatically refresh crowd list
    this.filterService.observer(CrowdComponent.LIST_TYPE).subscribe((data) => this.onRefreshList());
  }

  clearServicesSubscriptions() {
    this.filterService.observer(CrowdComponent.LIST_TYPE).unsubscribe();
    this.filterService.removeObserver(CrowdComponent.LIST_TYPE);
    if (this.serviceInstance) {
      this.serviceInstance.unsubscribe();
    }
  }

}
