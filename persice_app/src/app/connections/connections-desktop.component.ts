import {Component, OnInit, OnDestroy} from '@angular/core';

import {UsersListComponent} from '../shared/components/users-list';
import {LoadingComponent} from '../shared/components/loading';
import {FilterDesktopComponent} from '../shared/components/filter';
import {ProfileFriendComponent} from '../profile';
import {InfiniteScrollDirective} from '../../common/directives';

import {FilterService} from '../shared/services';
import {ConnectionsComponent, ConnectionsService} from '../../common/connections';

// Refresh list timeout in miliseconds (when filters change, list must refresh)
const LIST_REFRESH_TIMEOUT: number = 300;

@Component({
  selector: 'prs-connections',
  template: require('./connections.html'),
  directives: [
    FilterDesktopComponent,
    UsersListComponent,
    LoadingComponent,
    ProfileFriendComponent,
    InfiniteScrollDirective
  ],
  providers: [
    ConnectionsService
  ]
})
export class ConnectionsDesktopComponent
  extends ConnectionsComponent implements OnInit, OnDestroy {

  constructor(protected listService: ConnectionsService, protected filterService: FilterService) {
    super(listService, filterService, LIST_REFRESH_TIMEOUT);
  }

  ngOnInit() {
    this.getList();
    this.subscribeToFilterServiceUpdates();
  }

  ngOnDestroy() {
    this.clearServicesSubscriptions();
  }

  beforeItemSelected() {
    this.saveScrollPosition();
  }

  afterItemSelected(index?: number) {
    if (this.selectedItem.updated_at === null) {
      this.selectedItem.updated_at = 'seen';
    }
    this.setLocation(this.selectedItem[this.urlProperty]);
  }

  afterItemClosed() {
    this.setLocation(this.listType);
    this.restoreScrollPosition();
  }

}
