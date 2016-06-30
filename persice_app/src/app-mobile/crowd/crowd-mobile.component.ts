import {Component, OnInit, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {CrowdService} from '../../common/crowd';
import {CrowdComponent} from '../../common/crowd';
import {FilterMobileComponent} from '../shared/components/filter';
import {UserCardMobileComponent} from '../shared/components/user-card';
import {LoadingComponent} from '../../app/shared/components/loading';
import {FriendService, FilterService} from '../../app/shared/services';
import {AppStateService} from '../shared/services';
import {InfiniteScrollDirective} from '../../common/directives';
import {UserProfileComponent} from '../user-profile';

import {AppState} from '../../common/reducers';
import {SelectedPersonActions} from '../../common/actions';
import {HeaderState} from '../header';

const LIST_REFRESH_TIMEOUT: number = 0;

@Component({
  selector: 'prs-mobile-crowd',
  template: require('./crowd-mobile.html'),
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
    protected friendService: FriendService,
    protected filterService: FilterService,
    private appStateService: AppStateService,
    private store: Store<AppState>,
    private actions: SelectedPersonActions
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

    // TODO: think how to solve hiding intercom without using jQuery
    // This is a temporary workaround to hide intercom icon when opening profile page
    jQuery('#intercom-launcher').css('display', 'none');
  }

  acceptPassEvent(id: string) {
    this.removeItemById(id);
    this.closeItemView(null);
  }

  afterItemClosed() {

    this.appStateService.headerStateEmitter.emit(HeaderState.crowd);

    this.restoreScrollPosition();
    this._setBrowserLocationUrl('/crowd');


    // TODO: think how to solve showing intercom without using jQuery
    // This is a temporary workaround to show intercom icon after profile page is closed
    jQuery('#intercom-launcher').css('display', 'block');
  }
}
