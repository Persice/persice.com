import { findIndex } from 'lodash';
import { InterestsService, KeywordsService } from '../../app/shared/services';

/**
 *  Abstract class for managing user interests
 *  Loads keywords from KeywordsService
 *  Saves interests using InterestsService
 *  Creation of new keywords is done automatically when saving new interest
 */
export abstract class ManageInterestsComponent {

  // Minimum and maximum length of keyword in items list
  MINIMUM_ITEM_LENGTH: number = 2;
  MAXIMUM_ITEM_LENGTH: number = 100;

  // Number of keywords displayed on one page
  KEYWORDS_PER_PAGE: number = 100;

  // Limit for total number of interests
  INTERESTS_LIMIT: number = 1000;

  // API endpoint for autocomplete search in input
  AUTOCOMPLETE_API_ENDPOINT = '/api/v1/interest_subject/';

  // Attribute of API response, used for showing autocomplete search results
  AUTOCOMPLETE_API_ATTRIBUTE = 'description';

  // Way to keep track whether we add item from typeahead or via "Enter" key
  itemBeingAddedFromTypeahead: boolean = false;

  // Collection of keyword items managed by this component.
  items: any[] = [];

  // Collection of selected interests items managed by this component.
  selectedItems: any[] = [];

  loading: boolean = false;

  // Variables for tracking loading of keywords and pagination
  isListEmpty: boolean = false;
  query: string = '';
  next: string = '';
  total_count: number = 0;
  offset: number = 0;

  // New interest holder (input value)
  newItemText = '';

  // Status for showing error or success icon
  status: string;

  // Indicator whether new interest is being created
  interestBeingSaved: boolean = false;

  // Counter of selected items
  counter: number = 0;

  // Interests service instance
  serviceInstance;

  constructor(
    protected interestsService: InterestsService,
    protected keywordsService: KeywordsService
  ) {
  }

  public getList() {
    if (this.next === null) return;

    this.loading = true;
    this.interestsService.get('', this.INTERESTS_LIMIT)
      .mergeMap((data) => {
        this.counter = data.meta.total_count;
        this.afterCounterChanged();
        if (this.counter > 0) {
          this.selectedItems = data.objects;
        }
        return this.keywordsService.get(this.next, this.KEYWORDS_PER_PAGE, '');
      })
      .subscribe(data => this._assignList(data),
        (err) => {
          this.loading = false;
        });
  }

  public itemSelectedFromAutocomplete(event) {
    this.newItemText = event;
    this.itemBeingAddedFromTypeahead = true;
    this.add();
  }

  /**
   * Add the current item to the item collection and save on the backend.
   */
  public add() {
    let item: string = this.newItemText;
    if (!this.hasMinimumLength(item)) {
      this.status = 'failure';
      this.itemBeingAddedFromTypeahead = false;
      return;
    }

    if (!this.exceedsMaximumLength(item)) {
      this.status = 'failure';
      this.itemBeingAddedFromTypeahead = false;
      return;
    }

    // Clear typeahead input
    jQuery('#typeaheadInput').typeahead('val', '');

    // Create new interests or select existing
    this._save();
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

  /**
   * Load more items
   * @param {DOM event} event
   */
  public loadMoreItems(event) {
    if (this.next && !this.loading) {
      this.getList();
    }
  }

  public onInterestClick(event) {
    this.status = null;
    let idx = findIndex(this.items, event);

    if (this.items[idx]) {
      if (this.items[idx].active) {
        // If interest is already selected, delete it and deselect interest
        this._removeInterest(idx);
      } else {
        // Select interest
        this._addInterest(idx, false, false);
      }
    }
  }

  /**
   * Function called each time counter is changed
   */
  protected afterCounterChanged() { }

  private _save() {
    if (this.interestBeingSaved) {
      this.itemBeingAddedFromTypeahead = false;
      return;
    }
    this.interestBeingSaved = true;

    // Try to find index of keyword
    let idx = findIndex(this.items, {'description': this.newItemText});

    // If interest is found, check if it is already selected
    if (this.items[idx]) {
      if (!this.items[idx].active) {
        // If interest not selected, select it and save
        this._addInterest(idx, false, false);
      } else {
        // Trying to select already existing and selected interest
        this.status = 'failure';
        this.itemBeingAddedFromTypeahead = false;
        this.interestBeingSaved = false;
      }
    } else {
      // Keyword does not exist
      // Create new interest and push to items and do refresh of keywords
      this._addInterest(idx, true, true);
    }
  }

  private _refreshList() {
    this.items = [];
    this.selectedItems = [];
    this.isListEmpty = false;
    this.next = '';
    this.interestBeingSaved = false;
    this.counter = 0;
    this.total_count = 0;
    this.getList();
  }

  private _assignList(data) {
    this.loading = false;
    this.total_count = data.meta.total_count;
    if (this.total_count === 0) {
      this.isListEmpty = true;
      return;
    } else {
      this.isListEmpty = false;
    }
    let more = data.objects;
    for (var i = 0; i <= more.length - 1; i++) {
      more[i].active = false;
      more[i].interest_resource = null;

      for (var j = this.selectedItems.length - 1; j >= 0; j--) {
        if (more[i].resource_uri === this.selectedItems[j].interest) {
          more[i].interest_resource = this.selectedItems[j].resource_uri;
          more[i].active = true;
        }
      }

      this.items.push(more[i]);
    }

    this.next = data.meta.next;
    this.offset = data.meta.offset;
  }

  private _removeInterest(index) {
    let url = this.items[index].interest_resource;
    this.interestsService.delete(url)
      .subscribe((res) => {
        this.items[index].active = false;
        this.items[index].interest_resource = null;
        this.counter--;
        this.afterCounterChanged();
        this.itemBeingAddedFromTypeahead = false;
      }, (err) => {
        this.status = 'failure';
        this.itemBeingAddedFromTypeahead = false;
      });
  }

  /**
   * Saves new interest and optionally adds new interest to items
   * and triggers refreshing the list
   * @param {number} index    Index of item in items list
   * @param {boolean} refresh Indicator for refreshing the list
   * @param {boolean} add     Indicator for adding new item to list
   */
  private _addInterest(index: number, refresh: boolean, add: boolean) {
    let description: string = '';

    if (add) {
      description = this.newItemText;
    } else {
      description = this.items[index].description;
    }

    this.interestsService.save(description)
      .subscribe((res) => {
        if (!add) {
          // Keyword already exist
          // Mark newly saved interest as selected because
          this.items[index].active = true;
          this.items[index].interest_resource = res.resource_uri;
          this.newItemText = '';
        } else {
          // New keyword is created
          // Create new interest and push to items array
          let newItem = res;
          newItem.active = true;
          newItem.description = res.interest_subject;
          newItem.interest_resource = res.resource_uri;
          this.items.push(newItem);
          this.status = 'success';
          this.newItemText = '';
        }
        if (refresh) {
          this._refreshList();
        }
        this.itemBeingAddedFromTypeahead = false;
        this.interestBeingSaved = false;
        this.counter++;
        this.afterCounterChanged();
      }, (err) => {
        this.status = 'failure';
        this.interestBeingSaved = false;
        this.itemBeingAddedFromTypeahead = false;
      });
  }

  private hasMinimumLength(item: string): boolean {
    return item.length >= this.MINIMUM_ITEM_LENGTH;
  }

  private exceedsMaximumLength(item: string): boolean {
    return item.length <= this.MAXIMUM_ITEM_LENGTH;
  };

}
