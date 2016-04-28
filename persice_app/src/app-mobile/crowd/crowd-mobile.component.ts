import {Component, AfterViewInit, OnInit, OnDestroy} from 'angular2/core';

import {CrowdService} from '../../common/crowd';
import {CrowdComponent} from '../../common/crowd';
import {FilterMobileComponent} from '../shared/components/filter';
import {UserCardMobileComponent} from '../shared/components/user-card';
import {LoadingComponent} from '../../app/shared/components/loading';
import {FriendService, FilterService} from '../../app/shared/services';
import {AppStateService} from '../shared/services';
import {InfiniteScrollDirective} from '../../common/directives';
import {UserProfileComponent} from '../user-profile';

import {findIndex} from 'lodash';

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
export class CrowdComponentMobile extends CrowdComponent implements AfterViewInit, OnDestroy, OnInit {
  onRefreshList: Function;
  isFilterVisible: boolean = false;

  constructor(
    protected crowdService: CrowdService,
    protected friendService: FriendService,
    protected filterService: FilterService,
    public appStateService: AppStateService
  ) {
    super(crowdService, friendService, filterService);
    this.debounceTimeout = 0;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  ngOnInit() {
    this.total_count = 0;
    this.getList();

    // Create a new observer and subscribe.
    this.filterService.addObserver('crowd');
    this.filterService.observer('crowd')
      .subscribe(
      (data) => {
        this.onRefreshList();
      },
      (err) => console.log(err)
      );

    this.appStateService.isFilterVisibleEmitter
      .subscribe((visibility: boolean) => {
        this.isFilterVisible = visibility;
      });
  }

  ngOnDestroy() {
    this.filterService.observer('crowd').unsubscribe();
    this.filterService.removeObserver('crowd');
    if (this.serviceInstance) {
      this.serviceInstance.unsubscribe();
    }
  }

  setSelectedUser(id) {
    for (var i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].id === id) {
        this.selectedUser = this.items[i];
        // this.currentIndex = findIndex(this.items, { id: this.selectedUser.id });
        this.profileViewActive = true;
        this.appStateService.setHeaderVisibility(false);
        this.appStateService.setProfileFooterVisibility({
          visibility: true,
          score: this.selectedUser.score
        });
      }
    }
  }

  closeProfile(event) {
    this.profileViewActive = false;
    this.selectedUser = null;
    this.appStateService.setHeaderVisibility(true);
    this.appStateService.setProfileFooterVisibility({
      visibility: false,
      score: 0
    });
  }
}
