import {Component, AfterViewInit, OnDestroy} from '@angular/core';
import {FilterModel} from '../../../../app/shared/models';
import {FilterService} from '../../../../app/shared/services';
import {AutocompleteDirective} from '../../../../common/directives';

@Component({
  selector: 'prs-mobile-keywords',
  template: require('./keywords-mobile.html'),
  providers: [FilterService],
  directives: [AutocompleteDirective]
})
export class KeywordsComponentMobile implements AfterViewInit, OnDestroy {

  MINIMUM_ITEM_LENGTH: number = 2;

  // API endpoint for autocomplete search in input
  AUTOCOMPLETE_API_ENDPOINT = '/api/v1/interest_subject/';

  // Attribute of API response, used for showing autocomplete search results
  AUTOCOMPLETE_API_ATTRIBUTE = 'description';

  // Maximum allowed length of all items converted to string separated by comma
  // (e.g. "one,two,three"), including the comma character.
  MAXIMUM_LENGTH_OF_ITEMS: number = 50;

  // Collection of items managed by this component.
  items: any[] = [];

  // Label of current item, bound to the input field.
  newItemText: string = '';

  // Filters keep state of selected keywords.
  filters: FilterModel;

  // Whether the new item the user attempted to add was added successfully. Mostly used for styling
  // on the frontend. Adding could for example fail due to duplicates, or lenght constraints.
  status: string;

  // Way to keep track whether filter saving is in progress
  filtersSaving: boolean = false;

  // Way to keep track whether we add item from typeahead
  itemBeingAddedFromTypeahead: boolean = false;


  // Filter service instance
  serviceInstance;

  constructor(public filterService: FilterService) { }

  ngAfterViewInit() {
    this.serviceInstance = this.filterService.find()
      .subscribe(data => this.setInitialData(data));
  }

  ngOnDestroy() {
    this.serviceInstance.unsubscribe();
  }

  setInitialData(data) {
    this.filters = new FilterModel(data.objects[0]);
    if (this.filters.state.keyword.length > 0) {
      this.items = this.filters.state.keyword.split(',');
    }
  }

  itemSelectedFromAutocomplete(event) {
    this.newItemText = event;
    this.itemBeingAddedFromTypeahead = true;
    this.add();
  }

  /**
   * Parse changes to the input field. If "Enter" was pressed make an attempt to save new item.
   *
   * @param event DOM input event.
   */
  inputChanged(event) {
    if (event.which === 13) {
      if (!this.itemBeingAddedFromTypeahead) {
        this.add();
      }
    } else {
      this.status = '';
    }
  }

  /**
   * Add the current item to the item collection and save on the backend.
   */
  add() {
    let item: string = this.newItemText;
    if (!this.hasMinimumLength(item)) {
      this.status = 'failure';
      return;
    }

    if (this.exceedsMaximumLengthOfItems(this.items, item)) {
      this.status = 'failure';
      return;
    }

    if (this.items.indexOf(item) > -1) {
      this.status = 'failure';
      return;
    }

    this.items.push(item);
    this.status = 'success';

    // Clear typeahead input
    jQuery('#typeaheadInput').typeahead('val', '');

    this.save();
  }

  /**
   * Remove the item with a given label from the collection of items and save new collection on the
   * backend.
   *
   * @param item Item to remove.
   */
  remove(item) {
    this.items.splice(this.items.indexOf(item), 1);

    this.save();
  }

  /**
   * Save all current items on the backend.
   */
  save() {
    this._saveJoinedItems(this.items.join(','));
  }

  /**
   * Perform the actual save.
   *
   * @param items Items to save, comma-separated.
   * @private
   */
  private _saveJoinedItems(items: string) {
    if (this.filtersSaving) {
      return;
    }
    this.filtersSaving = true;
    let data = {
      keyword: items,
      user: this.filters.state.user
    };
    this.filterService.updateOne(this.filters.state.resource_uri, data)
      .subscribe(res => {
        this.newItemText = '';
        this.filtersSaving = false;
        this.itemBeingAddedFromTypeahead = false;
      }, (err) => {
        this.filtersSaving = false;
        this.status = 'failure';
      });


    this.newItemText = '';
  }

  private exceedsMaximumLengthOfItems(items: any[], newItem: string): boolean {
    return  [...items, newItem].join(',').length > this.MAXIMUM_LENGTH_OF_ITEMS;
  };

  private hasMinimumLength(item: string): boolean {
    return item.length >= this.MINIMUM_ITEM_LENGTH;
  };
}
