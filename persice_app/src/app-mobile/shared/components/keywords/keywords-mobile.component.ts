import {Component, AfterViewInit} from '@angular/core';
import {FilterModel} from '../../../../app/shared/models';
import {FilterService} from '../../../../app/shared/services';

@Component({
  selector: 'prs-mobile-keywords',
  template: require('./keywords-mobile.html'),
  providers: [FilterService]
})
export class KeywordsComponentMobile implements AfterViewInit {

  MINIMUM_ITEM_LENGTH: number = 2;

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

  // Way to keep track whether we add item from typeahead or via "Enter" key
  itemBeingAddedFromTypeahead: boolean = false;
  itemBeingAddedByEnterKey: boolean = false;

  constructor(public filterService: FilterService) { }

  ngAfterViewInit() {
    this.filterService.find()
      .subscribe(data => this.setInitialData(data));
  }

  setInitialData(data) {
    this.filters = new FilterModel(data.objects[0]);
    if (this.filters.state.keyword.length > 0) {
      this.items = this.filters.state.keyword.split(',');
    }
    this.initializeTokenInput();
  }

  initializeTokenInput() {
    let keywordsEngine = new Bloodhound({
      remote: {
        url: '/api/v1/interest_subject/?format=json&description__icontains=%QUERY',
        filter: (x: any) => {
          return jQuery.map(x.objects, (item) => {
            return item.description;
          });
        },
        wildcard: '%QUERY'
      },
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });

    keywordsEngine.initialize();

    var inputElement = jQuery('#typeaheadInput');
    inputElement.typeahead(
      {
        hint: false,
        highlight: true,
        minLength: this.MINIMUM_ITEM_LENGTH
      },
      {
        source: keywordsEngine,
        limit: 30
      }
    );

    inputElement.bind('typeahead:selected', (ev, suggestion) => {
      this.newItemText = suggestion;
      this.itemBeingAddedFromTypeahead = true;
      this.add();
    });
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
        this.itemBeingAddedByEnterKey = false;
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
