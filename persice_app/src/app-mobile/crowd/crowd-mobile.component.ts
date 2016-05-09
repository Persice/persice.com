import {Component, OnInit, OnDestroy} from '@angular/core';

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
export class CrowdMobileComponent extends CrowdComponent implements OnDestroy, OnInit {
  isFilterVisible: boolean = false;

  isFilterVisibleEmitterInstance;
  acceptPassEmitterInstance;

  constructor(
    protected listService: CrowdService,
    protected friendService: FriendService,
    protected filterService: FilterService,
    public appStateService: AppStateService
  ) {
    super(listService, friendService, filterService, LIST_REFRESH_TIMEOUT);
  }

  ngOnInit() {
    this.getList();
    this.subscribeToFilterServiceUpdates();

    // Control filter visibility
    this.isFilterVisibleEmitterInstance = this.appStateService.isFilterVisibleEmitter
      .subscribe((visibility: boolean) => {
        this.isFilterVisible = visibility;
      });

    // Subscribe to appStateService acceptPassEmitter
    // for knowing when to update friendship status via accept() or pass() methods
    this.acceptPassEmitterInstance = this.appStateService.acceptPassEmitter
      .subscribe((state: any) => {
        this._saveFriendshipStatus(state);
      });
  }

  ngOnDestroy() {
    this.clearServicesSubscriptions();

    // Unsubscribe from appStateService Emitters
    this.isFilterVisibleEmitterInstance.unsubscribe();
    this.acceptPassEmitterInstance.unsubscribe();
  }

  beforeItemSelected() {
    this.saveScrollPosition();

    // TODO: think how to solve hiding intercom without using jQuery
    // This is a temporary workaround to hide intercom icon when opening profile page
    jQuery('#intercom-launcher').css('display', 'none');
  }

  afterItemSelected() {
    // Hide profile header.
    this.appStateService.setHeaderVisibility(false);

    // Show profile footer visibility.
    this.appStateService.setProfileFooterVisibility({
      visibility: true,
      score: this.selectedItem.score,
      userId: this.selectedItem.id,
      type: 'crowd'
    });
  }

  afterItemClosed() {
    // Show top header.
    this.appStateService.setHeaderVisibility(true);

    // Hide profile footer.
    this.appStateService.setProfileFooterVisibility({
      visibility: false
    });

    this.restoreScrollPosition();

    // TODO: think how to solve showing intercom without using jQuery
    // This is a temporary workaround to show intercom icon after profile page is closed
    jQuery('#intercom-launcher').css('display', 'block');
  }

  private _saveFriendshipStatus(state): void {
    // Remove user from feed after friendship status is changed.
    this.removeItemById(state.userId);

    // When state.userId is equal to selected user's id attribute (selectedItem.id),
    // save new friendship state.
    if (this.selectedItem.id === state.userId) {
      this.friendService.saveFriendship(state.status, state.userId)
        .subscribe(data => {
          this.closeItemView(null);
        }, (err) => {
          this.closeItemView(null);
        });
    }
  }

}
