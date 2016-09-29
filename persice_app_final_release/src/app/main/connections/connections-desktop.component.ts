import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectionsComponent } from '../../../common/connections/connections.component';
import { ConnectionsService } from '../../../common/connections/connections.service';
import { FilterService } from '../../../common/services/filter.service';
import { Subscription } from 'rxjs/Subscription';
import { ConnectionsCounterService } from '../../../common/services/connections_counter.service';

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

  constructor(
    protected listService: ConnectionsService,
    protected filterService: FilterService,
    private newConnectionsCounterService: ConnectionsCounterService) {
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
    // If newly formed connection profile is being selected, mark it as 'seen'
    // and refresh new connections counter.
    if (!this.selectedItem.seen) {
      this.items[ index ] = Object.assign({}, this.items[ index ], { seen: true });
      let subs: Subscription = this.listService.markNewConnectionsAsSeen(this.selectedItem.id)
        .subscribe((dto) => {
          subs.unsubscribe();
          this.newConnectionsCounterService.refreshCounter();
        });
    }
    this.setLocation(this.selectedItem[ this.urlProperty ]);
  }

  protected afterItemClosed(): void {
    this.setLocation('pals');
    this.restoreScrollPosition();
  }

}
