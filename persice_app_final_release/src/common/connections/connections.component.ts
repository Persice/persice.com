import { FilterService } from '../services/filter.service';
import { ListComponent } from '../list';
import { ConnectionsService } from './connections.service';

export class ConnectionsComponent extends ListComponent {
  static LIST_TYPE: string = 'connections';
  static LIST_LIMIT: number = 12;

  constructor(
    protected listService: ConnectionsService,
    protected filterService: FilterService,
    protected listRefreshTimeout: number
  ) {
    super(listService, ConnectionsComponent.LIST_TYPE, ConnectionsComponent.LIST_LIMIT, 'username', listRefreshTimeout);
  }

  // TODO: rewrite subscribing to filter updates
  subscribeToFilterServiceUpdates() {

    // Add observer for filter updates
    this.filterService.addObserver(ConnectionsComponent.LIST_TYPE);

    // When filter updates, automatically refresh list
    this.filterService.observer(ConnectionsComponent.LIST_TYPE).subscribe((data) => this.onRefreshList());
  }

  clearServicesSubscriptions() {
    this.filterService.observer(ConnectionsComponent.LIST_TYPE).unsubscribe();
    this.filterService.removeObserver(ConnectionsComponent.LIST_TYPE);
    if (this.serviceInstance) {
      this.serviceInstance.unsubscribe();
    }
  }
}
