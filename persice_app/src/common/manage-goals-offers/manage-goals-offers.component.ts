import { findIndex } from 'lodash';

class Item {
  id: number;
  subject: string;
  resource_uri: string;

  constructor(id: number, subject: string, resource_uri: string) {
    this.id = id;
    this.subject = subject;
    this.resource_uri = resource_uri;
  }
}

export abstract class ManageGoalsOffersComponent {

  // Minimum and maximum length of keyword in items list
  MINIMUM_ITEM_LENGTH: number = 2;
  MAXIMUM_ITEM_LENGTH: number = 300;

  // API endpoint for autocomplete search in input
  AUTOCOMPLETE_API_ENDPOINT = '/api/v1/subject/';

  // Attribute of API response, used for showing autocomplete search results
  AUTOCOMPLETE_API_ATTRIBUTE = 'description';

  // Way to keep track whether we add item from typeahead or via "Enter" key
  itemBeingAddedFromTypeahead: boolean = false;

  // Collection of keyword items managed by this component.
  items: Item[] = [];

  // New goal or offer value holder (input value)
  newItemText: string = '';

  // Indicates whether list is loading
  loading: boolean = false;

  // Items per page
  ITEMS_PER_PAGE: number = 100;

  // Pagination vars
  next: string = '';
  total_count: number = 0;
  offset: number = 0;

  // Validation status when creating new item
  status: string;

  // Indicator whether list is empty after initial loading items data from backend
  isListEmpty: boolean = false;

  // Indicator whether goal/offer is being saved
  saveLoading: boolean = false;

  constructor(protected listService: any) { }

  /**
   * Gets items from service
   */
  public getList() {
    if (this.next === null) return;
    this.loading = true;
    this.listService.get(this.next, this.ITEMS_PER_PAGE)
      .subscribe(data => this._assignList(data),
        () => {
          this.loading = false;
        });
  }

  /**
   * Load more items
   * @param {DOM event} event
   */
  public loadMoreItems(event) {
    if (this.next && !this.loading) {
      this.getList();
    }
  }

  /**
   * Add the current item to the item collection and save on the backend.
   */
  public add() {
    let item: string = this.newItemText;
    if (!this.hasMinimumLength(item)) {
      this.status = 'failure';
      return;
    }

    if (!this.exceedsMaximumLength(item)) {
      this.status = 'failure';
      return;
    }

    if (this.exists(item)) {
      this.status = 'failure';
      return;
    }

    this.status = 'success';

    // Create new interests or select existing
    this._save();
  }

  public remove(event) {
    this._delete(event);
  }

  /**
   * Parse changes to the input field. If "Enter" was pressed make an attempt to save new item.
   *
   * @param event DOM input event.
   */
  public inputChanged(event) {
    if (event.which === 13) {
      if (!this.itemBeingAddedFromTypeahead) {
        this.add();
      }
    } else {
      this.status = '';
    }
  }

  public itemSelectedFromAutocomplete(event) {
    this.newItemText = event;
    this.itemBeingAddedFromTypeahead = true;
    this.add();
  }

  /**
   * Function called each time counter is changed
   */
  protected afterCounterChanged() { }

  private _save() {
    if (this.saveLoading) {
      return;
    }
    this.saveLoading = true;
    this.listService.save(this.newItemText).subscribe((response) => {
      let newItem = response;
      this.items.push(new Item(newItem.id, newItem.subject, newItem.resource_uri));
      this.status = 'success';
      this.total_count++;
      this.afterCounterChanged();
      this.checkIfListEmpty();
      this.saveLoading = false;
      this.newItemText = '';
      jQuery('#typeaheadInput').typeahead('val', '');
      this.itemBeingAddedFromTypeahead = false;
    }, (err) => {
      this.itemBeingAddedFromTypeahead = false;
      this.status = 'failure';
      this.saveLoading = false;
    });
  }

  private _delete(item: Item) {
    let idx = findIndex(this.items, item);
    if (this.items[idx]) {
      this.listService.delete(item.resource_uri)
        .subscribe((res) => {
          this.items.splice(idx, 1);
          this.total_count--;
          this.afterCounterChanged();
          this.checkIfListEmpty();
          this.itemBeingAddedFromTypeahead = false;
        });
    }
  }

  /**
   * Parse the response from server and render received items.
   *
   * @param data Data returned by server.
   */
  private _assignList(data) {
    this.loading = false;
    this.total_count = data.meta.total_count;

    this.afterCounterChanged();
    this.checkIfListEmpty();

    if (this.items.length > 0) {
      let more = data.objects;
      for (var i = 0; i <= more.length - 1; i++) {
        this.items.push(new Item(more[i].id, more[i].subject, more[i].resource_uri));
      }
    } else {
      this.items = data.objects;
    }
    this.next = data.meta.next;
    this.offset = data.meta.offset;
  }

  private hasMinimumLength(item: string): boolean {
    return item.length >= this.MINIMUM_ITEM_LENGTH;
  }

  private exceedsMaximumLength(item: string): boolean {
    return item.length <= this.MAXIMUM_ITEM_LENGTH;
  };

  private exists(subject: string): boolean {
    let idx = findIndex(this.items, {'subject': subject});
    if (idx > -1) {
      return true;
    } else {
      return false;
    }
  }

  private checkIfListEmpty() {
    if (this.total_count === 0) {
      this.isListEmpty = true;
    } else {
      this.isListEmpty = false;
    }
  }

}
