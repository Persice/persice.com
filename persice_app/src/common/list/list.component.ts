import { remove, findIndex, debounce } from 'lodash';

const DEFAULT_LIST_LIMIT: number = 12;

interface ListService {
  get: Function;
}
;

export abstract class ListComponent {

  // Collection of items managed by this component.
  items: Array<any> = [];

  // Loading indicators
  loading: boolean = false;
  loadingInitial: boolean = false;

  // Indicator whether list of items is empty.
  // Changes to true when initial loading of items returns 0 results.
  isListEmpty: boolean = false;

  // Indicator for whether there are more items to load from API
  next: string = '';

  // Total count of items loaded
  total_count: number = 0;

  // Limit for page size
  limit: number = DEFAULT_LIST_LIMIT;

  // Indicator for showing indidividual items
  itemViewActive = false;

  // Selected item to show
  selectedItem = null;

  // Index of selectedItem
  currentIndex = 0;

  // Instance of ListService Observable
  serviceInstance: any;

  // Debounced function for refreshing the list that delays invoking func until after
  // wait milliseconds have elapsed since the last time the debounced function was invoked.
  onRefreshList: Function;


  // Way to temporarily remember scroll position before item is selected
  // and restore it after item view is closed.
  windowScrollPosition: number = 0;

  constructor(
    protected listService: ListService,
    protected listType: string,
    protected listLimit: number,
    protected urlProperty: string,
    protected listRefreshTimeout: number
  ) {
    this.limit = listLimit;
    this.onRefreshList = debounce(
      this._refreshList,
      listRefreshTimeout,
      {
        'leading': false,
        'trailing': true
      }
    );
  }

  /**
   * Load items from listService
   */
  public getList() {
    if (this.loading) {
      return;
    }

    this.isListEmpty = false;
    if (this.next === null) return;
    this.loading = true;
    if (this.next === '') {
      this.loadingInitial = true;
    }
    this.serviceInstance = this.listService.get(this.next, this.limit)
      .subscribe(
        data => {
          this._assignList(data);
        },
        (err) => {
          this.loading = false;
          this.loadingInitial = false;
        });
  }

  /**
   * Select item by id atrribute
   * @param {number} id of selected item
   */
  public selectItem(itemId: number): void {

    this.beforeItemSelected();

    // Find index of item with item.id === itemId in items collection
    let index = findIndex(this.items, {id: itemId});

    // If item is found, select it and call afterItemSelected() function
    if (index !== -1) {
      this.selectedItem = this.items[index];
      this.currentIndex = index;
      this.itemViewActive = true;

      this.afterItemSelected(index);
    }
  }

  /**
   * Change URL of browser window to chosen item attribute
   * @param {string} value of item attribute
   */
  public setLocation(value: string) {
    window.history.pushState('', '', '/' + value);
  }

  /**
   * Close viewing of selectedItem
   * @param {DOM event} event
   */
  public closeItemView(event: any) {
    this.itemViewActive = false;
    this.selectedItem = null;
    this.afterItemClosed();
  }

  /**
   * Select previous item from items list and update currentIndex and selectedItem
   * @param {DOM event} event
   */
  public previousItem(event: any): void {
    let currentIndex = findIndex(this.items, {id: this.selectedItem.id});
    let newIndex = currentIndex - 1;

    if (newIndex < 0) {
      return;
    }

    if (this.items.length > 0) {
      this.selectedItem = this.items[newIndex];
      this.setLocation(this.selectedItem[this.urlProperty]);
    } else {
      this.closeItemView(true);
      this.isListEmpty = true;
    }
    this.currentIndex = newIndex;
  }

  /**
   * Select next item from items list and update currentIndex and selectedItem
   * @param {DOM event} event
   */
  public nextItem(event) {
    let currentIndex = findIndex(this.items, {id: this.selectedItem.id});
    let newIndex = currentIndex + 1;

    if (!this.loading && newIndex > this.items.length - 13 && this.next) {
      this.getList();
    }

    if (newIndex > this.items.length - 1) {
      return;
    }

    if (this.items.length > 0) {
      this.selectedItem = this.items[newIndex];
      this.setLocation(this.selectedItem[this.urlProperty]);
    } else {
      this.closeItemView(true);
      this.isListEmpty = true;
    }
    this.currentIndex = newIndex;
  }

  /**
   * Find item by id in items list and remove it
   * @param {string} itemId
   */
  public removeItemById(itemId: string): void {
    remove(this.items, (item) => {
      return item.id === itemId;
    });
    this.total_count--;
  }

  /**
   * Load more items from listService
   * @param {DOM event} event
   */
  public loadMoreItems(event) {
    if (this.next && !this.loading) {
      this.getList();
    }
  }

  /**
   * Temporarily remember window scroll position
   */
  protected saveScrollPosition() {
    this.windowScrollPosition = jQuery(window).scrollTop();
  }

  /**
   * Restore window scroll position
   */
  protected restoreScrollPosition() {
    setTimeout(() => {
      jQuery(window).scrollTop(this.windowScrollPosition);
    });
  }

  /**
   * Function which executres after viewing of selectedItem is closed
   * @param {any} optional param
   */
  protected afterItemClosed(param?: any) { }

  /**
   * Function which executes after item is selected
   * @param {any} optional param
   */
  protected afterItemSelected(param?: any) { }

  /**
   * Function which executes immediately before item is selected
   * @param {any} optional param
   */
  protected beforeItemSelected(param?: any) { }

  /**
   * Change the URL displayed in browsers location bar.
   */
  protected _setBrowserLocationUrl(path: string) {
    window.history.pushState('', '', `${path}`);
  }

  /**
   * Remove all items, reset all indicator variables and
   * reload new data from listService
   */
  private _refreshList() {
    this.items = [];
    this.total_count = 0;
    this.currentIndex = 0;
    this.isListEmpty = false;
    this.next = '';
    this.getList();
  }

  /**
   * Assign data from listService into items collection
   * @param {any} data
   */
  private _assignList(data: any) {
    this.loading = false;
    this.loadingInitial = false;

    if (data.meta.total_count === 0) {
      this.isListEmpty = true;
      return;
    } else {
      this.isListEmpty = false;
    }

    if (this.items.length > 0) {
      let more = data.objects;
      for (var i = 0; i <= more.length - 1; i++) {
        this.items = [...this.items, more[i]];
      }
      this.total_count += more.length;
    } else {
      this.items = data.objects;
      this.total_count = data.objects.length;
    }

    this.next = data.meta.next;
  }
}
