import {Component, OnInit, OnDestroy} from '@angular/core';

import {UsersListComponent} from '../shared/components/users-list';
import {LoadingComponent} from '../shared/components/loading';
import {FilterDesktopComponent} from '../shared/components/filter';
import {ProfileCrowdComponent} from '../profile';
import {InfiniteScrollDirective} from '../../common/directives';

import {
  FriendService,
  FilterService,
} from '../shared/services';

import {CrowdService, CrowdComponent} from '../../common/crowd';


// Refresh list timeout in miliseconds (when filters change, list must refresh)
const LIST_REFRESH_TIMEOUT: number = 300;

@Component({
  selector: 'prs-crowd',
  template: require('./crowd.html'),
  providers: [CrowdService, FriendService],
  directives: [
    FilterDesktopComponent,
    UsersListComponent,
    LoadingComponent,
    ProfileCrowdComponent,
    InfiniteScrollDirective
  ]
})
export class CrowdDesktopComponent extends CrowdComponent implements OnDestroy, OnInit {

  constructor(
    protected listService: CrowdService,
    protected friendService: FriendService,
    protected filterService: FilterService
  ) {
    super(listService, friendService, filterService, LIST_REFRESH_TIMEOUT);
  }

  ngOnInit() {
    this.getList();
    this.subscribeToFilterServiceUpdates();
  }

  ngOnDestroy() {
    this.clearServicesSubscriptions();
  }

  afterItemSelected() {
    this.setLocation(this.selectedItem[this.urlProperty]);
  }

  afterItemClosed() {
    this.setLocation(this.listType);
  }
}
