const LIST_TYPE: string = 'connections';
const LIST_LIMIT: number = 12;

import {ListComponent} from '../list';
import {ConnectionsService, FilterService} from '../../app/shared/services';

export class ConnectionsComponent extends ListComponent {

  constructor(
    protected listService: ConnectionsService,
    protected filterService: FilterService,
    protected listRefreshTimeout: number
  ) {
    super(listService, LIST_TYPE, LIST_LIMIT, 'username', listRefreshTimeout);
  }

  subscribeToFilterServiceUpdates() {

    // Add observer for filter updates
    this.filterService.addObserver(LIST_TYPE);

    // When filter updates, automatically refresh list
    this.filterService.observer(LIST_TYPE).subscribe((data) => this.onRefreshList());
  }

  clearServicesSubscriptions() {
    this.filterService.observer(LIST_TYPE).unsubscribe();
    this.filterService.removeObserver(LIST_TYPE);
    if (this.serviceInstance) {
      this.serviceInstance.unsubscribe();
    }
  }

}
