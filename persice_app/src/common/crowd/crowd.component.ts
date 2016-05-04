const LIST_TYPE: string = 'crowd';
const LIST_LIMIT: number = 12;

import {ListComponent} from '../list';
import {CrowdService} from './crowd.service';
import {FriendService} from "../../app/shared/services/friend.service";
import {FilterService} from "../../app/shared/services/filter.service";

export class CrowdComponent extends ListComponent {

  constructor(
    protected listService: CrowdService,
    protected friendService: FriendService,
    protected filterService: FilterService,
    protected listRefreshTimeout: number
  ) {
    super(listService, LIST_TYPE, LIST_LIMIT, 'username', listRefreshTimeout);
  }

  subscribeToFilterServiceUpdates() {

    // Add observer for filter updates
    this.filterService.addObserver(LIST_TYPE);

    // When filter updates, automatically refresh crowd list
    this.filterService.observer(LIST_TYPE).subscribe((data) => this.onRefreshList());
  }

  clearServicesSubscriptions() {
    this.filterService.observer(LIST_TYPE).unsubscribe();
    this.filterService.removeObserver(LIST_TYPE);
    if (this.serviceInstance) {
      this.serviceInstance.unsubscribe();
    }
  }

  pass(event) {
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

  accept(event) {
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


}
