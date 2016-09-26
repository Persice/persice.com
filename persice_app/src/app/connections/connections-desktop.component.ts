import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersListComponent } from '../shared/components/users-list';
import { LoadingComponent } from '../shared/components/loading';
import { FilterDesktopComponent } from '../shared/components/filter';
import { InfiniteScrollDirective } from '../../common/directives';
import { FilterService } from '../shared/services';
import { ConnectionsComponent, ConnectionsService } from '../../common/connections';
import { UserProfileDesktopCrowdPalsComponent } from '../profile/user-profile-desktop-crowd-pals.component';

// Refresh list timeout in miliseconds (when filters change, list must refresh)
const LIST_REFRESH_TIMEOUT: number = 300;

@Component({
  selector: 'prs-connections',
  template: <any>require('./connections.html'),
  directives: [
    FilterDesktopComponent,
    UsersListComponent,
    LoadingComponent,
    UserProfileDesktopCrowdPalsComponent,
    InfiniteScrollDirective
  ],
  providers: [
    ConnectionsService
  ]
})
export class ConnectionsDesktopComponent extends ConnectionsComponent implements OnInit, OnDestroy {

  private profileType: string = "connection";

  constructor(protected listService: ConnectionsService, protected filterService: FilterService) {
    super(listService, filterService, LIST_REFRESH_TIMEOUT);
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
    this.setLocation(this.selectedItem[this.urlProperty]);
  }

  protected afterItemClosed(): void {
    this.setLocation('pals');
    this.restoreScrollPosition();
  }

}
