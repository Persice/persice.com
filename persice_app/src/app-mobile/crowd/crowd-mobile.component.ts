import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { CrowdService, CrowdComponent } from '../../common/crowd';
import { FilterMobileComponent } from '../shared/components/filter';
import { UserCardMobileComponent } from '../shared/components/user-card';
import { LoadingComponent } from '../../app/shared/components/loading';
import { FriendService, FilterService } from '../../app/shared/services';
import { AppStateService } from '../shared/services';
import { InfiniteScrollDirective } from '../../common/directives';
import { UserProfileComponent } from '../user-profile';
import { HeaderState } from '../header';

const LIST_REFRESH_TIMEOUT: number = 0;

@Component({
  selector: 'prs-mobile-crowd',
  template: <any>require('./crowd-mobile.html'),
  providers: [CrowdService, FriendService],
  directives: [
    ROUTER_DIRECTIVES,
    LoadingComponent,
    UserCardMobileComponent,
    FilterMobileComponent,
    InfiniteScrollDirective,
    UserProfileComponent
  ]
})
export class CrowdMobileComponent extends CrowdComponent implements OnDestroy, OnInit {

  private isFilterVisible: boolean = false;
  private isFilterVisibleEmitterInstance;

  constructor(
    protected listService: CrowdService,
    protected filterService: FilterService,
    private appStateService: AppStateService
  ) {
    super(listService, filterService, LIST_REFRESH_TIMEOUT);
  }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit(HeaderState.crowd);
    this.getList();
    this.subscribeToFilterServiceUpdates();

    // Control filter visibility
    this.isFilterVisibleEmitterInstance = this.appStateService.isFilterVisibleEmitter
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

    // Unsubscribe from appStateService Emitters
    this.isFilterVisibleEmitterInstance.unsubscribe();
  }

  beforeItemSelected() {
    this.saveScrollPosition();
  }

  acceptPassEvent(id: string) {
    this.removeItemById(id);
    this.closeItemView(null);
  }

  selectPerson(person) {
    this.selectItem(person.id);
  }

  afterItemClosed() {

    this.appStateService.headerStateEmitter.emit(HeaderState.crowd);

    this.restoreScrollPosition();
    this._setBrowserLocationUrl('/crowd');

  }
}
