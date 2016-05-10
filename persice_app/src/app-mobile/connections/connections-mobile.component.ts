import {Component, OnInit, OnDestroy} from '@angular/core';

import {FilterService} from '../../app/shared/services';
import {ConnectionsComponent, ConnectionsService} from '../../common/connections';
import {FilterMobileComponent} from '../shared/components/filter';
import {UserCardMobileComponent} from '../shared/components/user-card';
import {LoadingComponent} from '../../app/shared/components/loading';
import {AppStateService} from '../shared/services';
import {InfiniteScrollDirective} from '../../common/directives';
import {UserProfileComponent} from '../user-profile';

const LIST_REFRESH_TIMEOUT: number = 0;

@Component({
  selector: 'prs-mobile-connections',
  template: require('./connections-mobile.html'),
  providers: [ConnectionsService],
  directives: [
    LoadingComponent,
    UserCardMobileComponent,
    FilterMobileComponent,
    InfiniteScrollDirective,
    UserProfileComponent
  ]
})
export class ConnectionsMobileComponent extends ConnectionsComponent implements OnDestroy, OnInit {
  isFilterVisible: boolean = false;

  constructor(
    protected listService: ConnectionsService,
    protected filterService: FilterService,
    public appStateService: AppStateService
  ) {
    super(listService, filterService, LIST_REFRESH_TIMEOUT);
  }

  ngOnInit() {
    this.getList();
    this.subscribeToFilterServiceUpdates();

    // Control filter visibility
    this.appStateService.isFilterVisibleEmitter
      .subscribe((visibility: boolean) => {
        this.isFilterVisible = visibility;
      });
  }

  ngOnDestroy() {
    this.clearServicesSubscriptions();
  }

  beforeItemSelected() {
    this.saveScrollPosition();
  }

  afterItemSelected() {
    // Hide profile header
    this.appStateService.setHeaderVisibility(false);

    // Show profile footer visibility
    this.appStateService.setProfileFooterVisibility({
      visibility: true,
      type: 'connection'
    });
  }

  afterItemClosed() {
    // Show top header
    this.appStateService.setHeaderVisibility(true);

    // Hide profile footer
    this.appStateService.setProfileFooterVisibility({
      visibility: false
    });

    this.restoreScrollPosition();
  }

}
