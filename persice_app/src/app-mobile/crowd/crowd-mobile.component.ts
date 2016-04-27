import {Component, AfterViewInit, OnInit, OnDestroy} from 'angular2/core';

import {CrowdService} from '../../common/crowd';
import {CrowdComponent} from '../../common/crowd';
import {FilterMobileComponent} from '../shared/components/filter';
import {UserCardMobileComponent} from '../shared/components/user-card';
import {LoadingComponent} from '../../app/shared/components/loading';
import {FriendService, FilterService} from '../../app/shared/services';
import {InfiniteScrollDirective} from '../../common/directives';


@Component({
  selector: 'prs-mobile-crowd',
  template: require('./crowd-mobile.html'),
  providers: [CrowdService, FriendService],
  directives: [
    LoadingComponent,
    UserCardMobileComponent,
    FilterMobileComponent,
    InfiniteScrollDirective
  ]
})
export class CrowdComponentMobile extends CrowdComponent implements AfterViewInit, OnDestroy, OnInit {
  onRefreshList: Function;
  isFilterVisible: boolean = false;

  constructor(
    protected crowdService: CrowdService,
    protected friendService: FriendService,
    protected filterService: FilterService
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

    this.filterService.isVisibleEmitter
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
}
