import {Component, ElementRef, AfterViewInit} from '@angular/core';

import {FilterModel} from '../shared/models';
import {
  KeywordsService,
  NotificationService,
  FilterService
} from '../shared/services';

import {map} from 'lodash';


declare var Bloodhound: any;

@Component({
  selector: 'prs-search',
  providers: [KeywordsService],
  template: `
  <input type="text" class="search__input" id="tokenfield-typeahead" placeholder="Search by interest...">
  `
})
export class SearchComponent implements AfterViewInit {
  keywords: any[];
  filters: FilterModel;
  timeoutIdFiltersSave = null;

  constructor(
    public el: ElementRef,
    public filterService: FilterService,
    public keywordsService: KeywordsService,
    public notificationService: NotificationService
  ) {
  }

  ngAfterViewInit() {

    this.filterService.find()
      .subscribe(data => this.setKeywords(data));

  }

  setKeywords(data) {
    this.filters = new FilterModel(data.objects[0]);
    if (this.filters.state.keyword.length > 0) {
      this.keywords = this.filters.state.keyword.split(',');
    }
    this.initializeTokenInput(this.filters.state.keyword);
  }

  initializeTokenInput(initialTokens) {
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
      datumTokenizer: (d) => {
        return Bloodhound.tokenizers.whitespace(d);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });

    keywordsEngine.initialize();

    jQuery(this.el.nativeElement).tokenfield({
      limit: 10,
      tokens: initialTokens,
      typeahead: [null, {
        source: keywordsEngine.ttAdapter(),
        minLength: 2,
        highlight: true
      }]
    });

    jQuery('input.tt-input').attr('placeholder', 'Search by interest...');


    //save keywords to backend after token created
    jQuery(this.el.nativeElement).on('tokenfield:createdtoken', (event) => {
      let existingTokens = jQuery(this.el.nativeElement).tokenfield('getTokens');
      existingTokens = map(existingTokens, 'value');
      this.save(existingTokens.join());
    });

    //save keywords to backend after token removed
    jQuery(this.el.nativeElement).on('tokenfield:removedtoken', (event) => {
      let existingTokens = jQuery(this.el.nativeElement).tokenfield('getTokens');
      existingTokens = map(existingTokens, 'value');
      this.save(existingTokens.join());
    });

    //prevent duplicates and total keywords string length > 50 chars
    jQuery(this.el.nativeElement).on('tokenfield:createtoken', (event) => {
      let existingTokens = jQuery(this.el.nativeElement).tokenfield('getTokens');
      let tokensString = [...map(existingTokens, 'value'), event.attrs.value];

      let tokenInput = event.attrs.value;

      if (tokensString.join().length > 45) {
        this.notificationService.push({
          title: '',
          body: 'No more keywords allowed.',
          type: 'warning',
          autoclose: 4000
        });
        event.preventDefault();
      } else {

        if (tokenInput.length < 2) {
          this.notificationService.push({
            title: '',
            body: 'Keyword must have at least two characters',
            type: 'warning',
            autoclose: 4000
          });
          event.preventDefault();
          return;
        }
        jQuery.each(existingTokens, (index, token) => {
          if (token.value === event.attrs.value) {
            this.notificationService.push({
              title: '',
              body: 'Keyword is already entered',
              type: 'warning',
              autoclose: 4000
            });
            event.preventDefault();
          }
        });
      }

    });
  }

  save(tokens) {
    let data = {
      keyword: tokens,
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
  }

}
