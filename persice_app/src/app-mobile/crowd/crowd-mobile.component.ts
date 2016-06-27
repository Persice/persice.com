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

import {AppState, getSelectedPersonState} from '../../common/reducers';
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

  private accepted$: Observable<boolean>;
  private passed$: Observable<boolean>;

  constructor(
    protected listService: CrowdService,
    protected friendService: FriendService,
    protected filterService: FilterService,
    private appStateService: AppStateService,
    private store: Store<AppState>,
    private actions: SelectedPersonActions
  ) {
    super(listService, filterService, LIST_REFRESH_TIMEOUT);

    const store$ = store.let(getSelectedPersonState());
    this.accepted$ = store$.map((data) => data['accept']);
    this.passed$ = store$.map((data) => data['pass']);

    this.accepted$.subscribe((status: boolean) => {
      if (!!status) {
        this._saveFriendshipStatus(0);
      }
    });

    this.passed$.subscribe((status: boolean) => {
      if (!!status) {
        this._saveFriendshipStatus(-1);
      }

    });

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

  afterItemSelected() {
    // Set selectedItem as selected person and profileype as 'crowd' in SelectedPerson App Store
    this.store.dispatch(this.actions.set(this.selectedItem, 'crowd'));

    // Show profile footer visibility.
    this.appStateService.setProfileFooterVisibility({
      visibility: true
    });
  }

  afterItemClosed() {
    // Clear selected person from SelectedPerson App Store
    this.store.dispatch(this.actions.clear());

    this.appStateService.headerStateEmitter.emit(HeaderState.crowd);

    // Hide profile footer.
    this.appStateService.setProfileFooterVisibility({
      visibility: false
    });

    this.restoreScrollPosition();
    this._setBrowserLocationUrl('/crowd');


    // TODO: think how to solve showing intercom without using jQuery
    // This is a temporary workaround to show intercom icon after profile page is closed
    jQuery('#intercom-launcher').css('display', 'block');
  }

  private _saveFriendshipStatus(status: number): void {
    if (!!this.selectedItem) {
      const id: string = this.selectedItem.id;
      this.removeItemById(this.selectedItem.id);
      this.friendService.saveFriendship(status, id)
        .subscribe(data => {
          this.closeItemView(null);
        }, (err) => {
          this.closeItemView(null);
        });
    }
  }
}
