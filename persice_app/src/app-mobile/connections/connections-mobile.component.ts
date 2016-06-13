import {Component, OnInit, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';

import {FilterService} from '../../app/shared/services';
import {ConnectionsComponent, ConnectionsService} from '../../common/connections';
import {NewConnectionsCounterService} from '../../common/services';
import {FilterMobileComponent} from '../shared/components/filter';
import {UserCardMobileComponent} from '../shared/components/user-card';
import {LoadingComponent} from '../../app/shared/components/loading';
import {AppStateService} from '../shared/services';
import {InfiniteScrollDirective} from '../../common/directives';
import {UserProfileComponent} from '../user-profile';

import {AppState} from '../../common/reducers';
import {SelectedPersonActions} from '../../common/actions';

import {Subscription} from 'rxjs';

const LIST_REFRESH_TIMEOUT: number = 0;

@Component({
  selector: 'prs-mobile-connections',
  template: require('./connections-mobile.html'),
  providers: [ConnectionsService, NewConnectionsCounterService],
  directives: [
    LoadingComponent,
    UserCardMobileComponent,
    FilterMobileComponent,
    InfiniteScrollDirective,
    UserProfileComponent
  ]
})
export class ConnectionsMobileComponent extends ConnectionsComponent implements OnDestroy, OnInit {
  isFilterVisible: boolean = false;

  constructor(
    protected listService: ConnectionsService,
    protected filterService: FilterService,
    public appStateService: AppStateService,
    private newConnectionsCounterService: NewConnectionsCounterService,
    private store: Store<AppState>,
    private actions: SelectedPersonActions
  ) {
    super(listService, filterService, LIST_REFRESH_TIMEOUT);
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
    // Show top header
    this.appStateService.setHeaderVisibility(true);

    // Hide profile footer
    this.appStateService.setProfileFooterVisibility({
      visibility: false
    });
  }

  beforeItemSelected() {
    this.saveScrollPosition();
  }

  afterItemSelected(index?: number) {
    // Set selectedItem as selected person and profileype as 'connection' in SelectedPerson App Store
    this.store.dispatch(this.actions.set(this.selectedItem, 'connection'));

    // Hide profile header
    this.appStateService.setHeaderVisibility(false);

    // Show profile footer visibility
    this.appStateService.setProfileFooterVisibility({
      visibility: true
    });

    // If newly formed connection profile is being selected, mark it as 'seen'
    // and refresh new connections counter.
    if (this.selectedItem.updated_at === null) {
      this.items[index] = Object.assign({}, this.items[index], {updated_at: 'seen'});
      let subs: Subscription = this.listService.markNewConnectionsAsSeen(this.selectedItem.id)
        .subscribe((dto) => {
          subs.unsubscribe();
          this.newConnectionsCounterService.refresh();
        });
    }
  }

  afterItemClosed() {
    // Clear selected person from SelectedPerson App Store
    this.store.dispatch(this.actions.clear());

    // Show top header
    this.appStateService.setHeaderVisibility(true);

    // Hide profile footer
    this.appStateService.setProfileFooterVisibility({
      visibility: false
    });

    this.restoreScrollPosition();
  }

}
