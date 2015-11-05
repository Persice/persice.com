/// <reference path="../../../typings/_custom.d.ts" />

import {Component, CORE_DIRECTIVES, ElementRef, Inject} from 'angular2/angular2';
import {FilterModel} from '../../models/filter.model';
import {FilterService} from '../../services/filter.service';

import {pluck, debounce} from 'lodash';

declare var jQuery: any;

declare var Bloodhound: any;

let view = require('./searchkeywordsinput.html');
@Component({
  selector: 'search-keywordsinput',
  directives: [CORE_DIRECTIVES],
  template: view
})
export class SearchKeywordsInputComponent {
  el: ElementRef;
  keywords: any[];
  filters: FilterModel;

  constructor(
    @Inject(ElementRef) el: ElementRef,
    public filterService: FilterService
  ) {
    this.el = el;
  }

  afterViewInit() {

    this.filterService.get()
      .map(res => res.json())
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
    let keywords = ['Acting', 'Animals', 'Backpacking', 'Django', 'Angular',
      'Code', 'Badminton', 'Swim', 'Kitesurf', 'Crossfit', 'Chinese', 'Volleybal',
      'Animals', 'Mountain Biking', 'Machine Learning', 'Incubator', 'Astronomy',
      'Cycling', 'Banjo'
    ];


    let engine = new Bloodhound({
      local: keywords,
      datumTokenizer: (d) => {
        return Bloodhound.tokenizers.whitespace(d);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });

    engine.initialize();

    jQuery(this.el.nativeElement).tokenfield({
      minLength: 2,
      limit: 10,
      tokens: initialTokens,
      typeahead: [null, { source: engine.ttAdapter() }]
    });

    //prevent duplicates for token entry
    jQuery(this.el.nativeElement).on('tokenfield:createtoken', (event) => {
      let existingTokens = jQuery(this.el.nativeElement).tokenfield('getTokens');
      $.each(existingTokens, (idex, token) => {
        if (token.value === event.attrs.value)
          event.preventDefault();
      });
    });

    //save keywords to backend after token created
    jQuery(this.el.nativeElement).on('tokenfield:createdtoken', (event) => {
      let existingTokens = jQuery(this.el.nativeElement).tokenfield('getTokens');
      existingTokens = pluck(existingTokens, 'value');
      this.save(existingTokens.join());
    });

    //save keywords to backend after token removed
    jQuery(this.el.nativeElement).on('tokenfield:removedtoken', (event) => {
      let existingTokens = jQuery(this.el.nativeElement).tokenfield('getTokens');
      existingTokens = pluck(existingTokens, 'value');
      this.save(existingTokens.join());
    });

    //prevent duplicates and total keywords string length > 50 chars
    jQuery(this.el.nativeElement).on('tokenfield:createtoken', (event) => {
      let existingTokens = jQuery(this.el.nativeElement).tokenfield('getTokens');

      let tokensString = pluck(existingTokens, 'value');
      if (tokensString.join().length > 45) {
        event.preventDefault();
      }
      else {
        $.each(existingTokens, (index, token) => {
          if (token.value === event.attrs.value)
            event.preventDefault();
        });
      }

    });
  }

  save(tokens) {
    let data = {
      keyword: tokens,
      user: this.filters.state.user
    };
    this.filterService.save(this.filters.state.resource_uri, data);
  }

}
