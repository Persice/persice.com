import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderState } from '../header';
import { Subscription } from 'rxjs';
import { ConnectionsService, ConnectionsComponent } from '../../../common/connections';
import { NewConnectionsCounterService } from '../../../common/services';
import { FilterService } from '../../../common/services/filter.service';
import { AppStateService } from '../../shared/services';

const LIST_REFRESH_TIMEOUT: number = 0;

@Component({
  selector: 'prs-mobile-connections',
  templateUrl: './connections-mobile.html',
  providers: [ ConnectionsService, NewConnectionsCounterService ]
})
export class ConnectionsMobileComponent extends ConnectionsComponent implements OnDestroy, OnInit {
  isFilterVisible: boolean = false;

  constructor(
    protected listService: ConnectionsService,
    protected filterService: FilterService,
    public appStateService: AppStateService,
    private newConnectionsCounterService: NewConnectionsCounterService
  ) {
    super(listService, filterService, LIST_REFRESH_TIMEOUT);
  }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit(HeaderState.connections);
    this.getList();
    this.subscribeToFilterServiceUpdates();

    // Control filter visibility
    this.appStateService.isFilterVisibleEmitter
      .subscribe((visibility: boolean) => {
        this.isFilterVisible = visibility;
      });

    // Is List view visible
    this.appStateService.goBackToListViewEmitter.subscribe((data) => {
      this.closeItemView(undefined);
    });
  }

  ngOnDestroy() {
    this.clearServicesSubscriptions();
  }

  selectPerson(person) {
    this.selectItem(person.id);
  }

  beforeItemSelected() {
    this.saveScrollPosition();
  }

  afterItemSelected(index?: number) {

    // If newly formed connection profile is being selected, mark it as 'seen'
    // and refresh new connections counter.
    if (!!!this.selectedItem.seen) {
      this.items[ index ] = Object.assign({}, this.items[ index ], { seen: true });
      let subs: Subscription = this.listService.markNewConnectionsAsSeen(this.selectedItem.id)
        .subscribe((dto) => {
          subs.unsubscribe();
          this.newConnectionsCounterService.refresh();
        });
    }
  }

  afterProfileDisconnected(userId) {
    if (!!this.selectedItem && this.selectedItem.id === userId) {
      const id: string = this.selectedItem.id;
      this.removeItemById(id);
      this.newConnectionsCounterService.refresh();
    }
    this.closeItemView(event);
  }

  afterItemClosed() {

    this.appStateService.headerStateEmitter.emit(HeaderState.connections);

    this.restoreScrollPosition();
    this._setBrowserLocationUrl('/pals');
  }
}
