import {Component, AfterViewInit, OnInit, OnDestroy} from 'angular2/core';
import {Router} from 'angular2/router';

import {CrowdService} from "../../common/crowd/crowd.service";
import {CrowdComponent} from "../../common/crowd/crowd.component";
import {FilterComponent} from "../../app/shared/components/filter/filter.component";
import {UsersListComponent} from "../../app/shared/components/users-list/users-list.component";
import {LoadingComponent} from "../../app/shared/components/loading/loading.component";
import {ProfileCrowdComponent} from "../../app/profile/profile-crowd.component";
import {FriendService} from "../../app/shared/services/friend.service";
import {FilterService} from "../../app/shared/services/filter.service";

declare var jQuery: any;

@Component({
  selector: 'prs-mobile-crowd',
  template: require('./crowd-mobile.html'),
  providers: [CrowdService, FriendService, FilterService],
  directives: [
    FilterComponent,
    UsersListComponent,
    LoadingComponent,
    ProfileCrowdComponent
  ]
})
export class CrowdComponentMobile extends CrowdComponent implements AfterViewInit, OnDestroy, OnInit {
  onRefreshList: Function;

  constructor(
    protected crowdService: CrowdService,
    protected friendService: FriendService,
    protected filterService: FilterService,
    protected _router: Router
  ) {
    super(crowdService, friendService, filterService, _router);
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
