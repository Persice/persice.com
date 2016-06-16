import {Component, Input, ChangeDetectionStrategy } from '@angular/core';

const LESS_ITEMS_LIMIT: number = 6;

@Component({
  selector: 'prs-mobile-items-list',
  template: require('./items-list.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsListMobileComponent {

  // When [items] from Input property change, set internal state for our component
  @Input() set items(listOfItems: any[]) {
    this._setState(listOfItems);
  }

  // List of component items
  public itemsLess: any[] = [];
  public itemsMore: any[] = [];

  // Counter for total number of items
  public itemsCounter: number = 0;

  // Indicator whether more items are visible in the UI
  public itemsMoreVisible: boolean = false;

  // Indicator whether moreButton is visible in the UI
  public moreButtonVisible: boolean = false;

  public toggleMore(event) {
    this.itemsMoreVisible = !this.itemsMoreVisible;
  }

  /**
   * Set itemsLess, itemsMore, counters and visibility flag for more button
   * @param {any[]} listOfItems
   */
  private _setState(listOfItems: any[]) {
    this.itemsCounter = listOfItems.length;

    if (this.itemsCounter > LESS_ITEMS_LIMIT) {
      this.itemsLess = listOfItems.slice(0, LESS_ITEMS_LIMIT);
      this.itemsMore = listOfItems.slice(LESS_ITEMS_LIMIT, this.itemsCounter);
      this.moreButtonVisible = true;
    } else {
      this.itemsLess = listOfItems;
      this.moreButtonVisible = false;
    }

  }

}
