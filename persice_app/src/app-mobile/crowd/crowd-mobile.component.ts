import {Component, AfterViewInit, OnInit, OnDestroy} from '@angular/core';

import {CrowdService} from '../../common/crowd';
import {CrowdComponent} from '../../common/crowd';
import {FilterMobileComponent} from '../shared/components/filter';
import {UserCardMobileComponent} from '../shared/components/user-card';
import {LoadingComponent} from '../../app/shared/components/loading';
import {FriendService, FilterService} from '../../app/shared/services';
import {AppStateService} from '../shared/services';
import {InfiniteScrollDirective} from '../../common/directives';
import {UserProfileComponent} from '../user-profile';

const LIST_REFRESH_TIMEOUT: number = 0;

@Component({
  selector: 'prs-mobile-crowd',
  template: require('./crowd-mobile.html'),
  providers: [CrowdService, FriendService],
  directives: [
    LoadingComponent,
    UserCardMobileComponent,
    FilterMobileComponent,
    InfiniteScrollDirective,
    UserProfileComponent
  ]
})
export class CrowdMobileComponent
  extends CrowdComponent implements AfterViewInit, OnDestroy, OnInit {
  isFilterVisible: boolean = false;

  constructor(
    protected listService: CrowdService,
    protected friendService: FriendService,
    protected filterService: FilterService,
    public appStateService: AppStateService
  ) {
    super(listService, friendService, filterService, LIST_REFRESH_TIMEOUT);
  }

  ngAfterViewInit() {
    this.scrollTop();
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

  afterItemSelected() {

    // Hide profile header
    this.appStateService.setHeaderVisibility(false);

    // Show profile footer visibility
    this.appStateService.setProfileFooterVisibility({
      visibility: true,
      score: this.selectedItem.score
    });
  }

  afterItemClosed() {

    // Show top header
    this.appStateService.setHeaderVisibility(true);

     // Hide profile footer
    this.appStateService.setProfileFooterVisibility({
      visibility: false,
      score: 0
    });
  }

}
