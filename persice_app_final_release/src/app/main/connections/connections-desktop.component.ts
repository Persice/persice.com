import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectionsComponent } from '../../../common/connections/connections.component';
import { ConnectionsService } from '../../../common/connections/connections.service';
import { FilterService } from '../../../common/services/filter.service';

@Component({
  selector: 'prs-connections',
  templateUrl: './connections.html',
  providers: [
    ConnectionsService
  ]
})
export class ConnectionsDesktopComponent extends ConnectionsComponent implements OnInit, OnDestroy {
  static LIST_REFRESH_TIMEOUT: number = 300;

  private profileType: string = "connection";

  constructor(protected listService: ConnectionsService, protected filterService: FilterService) {
    super(listService, filterService, ConnectionsDesktopComponent.LIST_REFRESH_TIMEOUT);
  }

  ngOnInit(): any {
    this.getList();
    this.subscribeToFilterServiceUpdates();
  }

  ngOnDestroy(): any {
    this.clearServicesSubscriptions();
  }

  protected beforeItemSelected(): void {
    this.saveScrollPosition();
  }

  protected afterItemSelected(index?: number): void {
    if (this.selectedItem.updated_at === null) {
      this.selectedItem.updated_at = 'seen';
    }
    this.setLocation(this.selectedItem[ this.urlProperty ]);
  }

  protected afterItemClosed(): void {
    this.setLocation('pals');
    this.restoreScrollPosition();
  }

}
