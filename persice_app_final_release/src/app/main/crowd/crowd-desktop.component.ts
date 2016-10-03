import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrowdComponent } from '../../../common/crowd/crowd.component';
import { CrowdService } from '../../../common/crowd/crowd.service';
import { FriendService } from '../../../common/services/friend.service';
import { FilterService } from '../../../common/services/filter.service';

@Component({
  selector: 'prs-crowd',
  templateUrl: './crowd.html',
  providers: [
    CrowdService,
    FriendService
  ]
})
export class CrowdDesktopComponent extends CrowdComponent implements OnDestroy, OnInit {
  static LIST_REFRESH_TIMEOUT: number = 300;

  private profileType: string = "crowd";

  constructor(
    protected listService: CrowdService,
    protected friendService: FriendService,
    protected filterService: FilterService
  ) {
    super(listService, filterService, CrowdDesktopComponent.LIST_REFRESH_TIMEOUT);
  }

  ngOnInit(): any {
    this.getList();
    this.subscribeToFilterServiceUpdates();
  }

  ngOnDestroy(): any {
    this.clearServicesSubscriptions();
  }

  public pass(event): void {
    this.removeItemById(event.user);
    if (event.next) {
      this.nextItem(true);
    }

    this.friendService.saveFriendship(-1, event.user)
      .subscribe(data => {
        if (!event.next || this.items.length === 0) {
          this.itemViewActive = false;
          this.selectedItem = null;
        }

      }, (err) => {
        if (!event.next || this.items.length === 0) {
          this.itemViewActive = false;
          this.selectedItem = null;
        }
      });
  }

  public accept(event): void {
    this.removeItemById(event.user);
    if (event.next) {
      this.nextItem(true);
    }
    this.friendService.saveFriendship(0, event.user)
      .subscribe(data => {
        if (!event.next || this.items.length === 0) {
          this.itemViewActive = false;
          this.selectedItem = null;
        }
      }, (err) => {
        if (!event.next || this.items.length === 0) {
          this.itemViewActive = false;
          this.selectedItem = null;
        }
      });
  }

  protected beforeItemSelected() {
    this.saveScrollPosition();
  }

  protected afterItemSelected() {
    this.setLocation(this.selectedItem[ this.urlProperty ]);
  }

  protected afterItemClosed() {
    this.setLocation(this.listType);
    this.restoreScrollPosition();
  }
}
