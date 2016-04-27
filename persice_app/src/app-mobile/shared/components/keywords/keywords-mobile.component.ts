import {Component} from 'angular2/core';
import {FilterModel} from '../../../../app/shared/models';
import {FilterService} from '../../../../app/shared/services';

@Component({
  selector: 'prs-mobile-keywords',
  template: require('./keywords-mobile.html'),
  providers: [
    FilterService
  ]
})
export class KeywordsComponentMobile {

  MINIMUM_ITEM_LENGTH: number = 2;
  MAXIMUM_NUMBER_OF_ITEMS: number = 45;

  // Collection of items managed by this component.
  items: any[] = [];

  // Label of current item, bound to the input field.
  newItemText: string;

  // Filters keep state of selected keywords.
  filters: FilterModel;

  // Whether the new item the user attempted to add was added successfully. Mostly used for styling
  // on the frontend. Adding could for example fail due to duplicates, or lenght constraints.
  status: string;

  // Way to keep track whether filter saving operation time-outed.
  timeoutIdFiltersSave = null;

  constructor(public filterService: FilterService) {}

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
      this.add();
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

    if (this.exceedsMaximumNumberOfItems(this.items)) {
      this.status = 'failure';
      return;
    }

    if (this.items.indexOf(item) > -1) {
      this.status = 'failure';
      return;
    }

    this.items.push(item);

    this.status = 'success';
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
    let data = {
      keyword: items,
      user: this.filters.state.user
    };
    if (this.timeoutIdFiltersSave) {
      window.clearTimeout(this.timeoutIdFiltersSave);
    }
    this.timeoutIdFiltersSave = window.setTimeout(() => {
      this.filterService.updateOne(this.filters.state.resource_uri, data)
        .subscribe(res => {
          this.filterService.publishObservers();
        });
    }, 250);

    this.newItemText = '';
  }

  private exceedsMaximumNumberOfItems(items: any[]) {
    return items.length > this.MAXIMUM_NUMBER_OF_ITEMS;
  };

  private hasMinimumLength(item: string) {
    return item.length >= this.MINIMUM_ITEM_LENGTH;
  };
}
