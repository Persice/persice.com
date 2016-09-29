import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderState } from '../header';
import { CrowdService, CrowdComponent } from '../../../common/crowd';
import { FriendService } from '../../../common/services/friend.service';
import { FilterService } from '../../../common/services/filter.service';
import { AppStateService } from '../../shared/services';

const LIST_REFRESH_TIMEOUT: number = 0;

@Component({
  selector: 'prs-mobile-crowd',
  templateUrl: './crowd-mobile.html',
  providers: [ CrowdService, FriendService ]
})
export class CrowdMobileComponent extends CrowdComponent implements OnDestroy, OnInit {

  public isFilterVisible: boolean = false;
  public isFilterVisibleEmitterInstance;

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
