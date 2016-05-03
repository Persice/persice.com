import {Component, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router-deprecated';

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
export class CrowdComponentDesktop extends CrowdComponent implements AfterViewInit, OnDestroy, OnInit {
  onRefreshList: Function;
  routerInstance;

  constructor(
    protected crowdService: CrowdService,
    protected friendService: FriendService,
    protected filterService: FilterService,
    protected _router: Router
  ) {
    super(crowdService, friendService, filterService);
    this.debounceTimeout = 300;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  ngOnInit() {
    this.routerInstance = this._router.parent.subscribe(next => {
      this.closeProfile(true);
    });

    this.total_count = 0;
    this.getList();

    // Create a new observer and subscribe.
    this.filterService.addObserver('crowd');
    this.filterService.observer('crowd')
      .subscribe((data) => this.onRefreshList(), (err) => console.log(err));
  }

  ngOnDestroy() {
    this.filterService.observer('crowd').unsubscribe();
    this.filterService.removeObserver('crowd');
    if (this.serviceInstance) {
      this.serviceInstance.unsubscribe();
    }

    this.routerInstance.unsubscribe();
  }
}
