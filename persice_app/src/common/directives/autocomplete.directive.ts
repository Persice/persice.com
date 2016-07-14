import { Directive, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

const RESULTS_LIMIT: number = 30;

/**
 * Directive for Twitter Typeahead plugin
 */
@Directive({
  selector: '[persice-autocomplete]'
})
export class AutocompleteDirective implements OnInit, OnDestroy {
  @Input() apiUrl: string;
  @Input() apiAttr: string;
  @Input() minLength: number;
  @Output() onSelected: EventEmitter<any> = new EventEmitter();

  inputElement;

  constructor(private _el: ElementRef) {
    this.inputElement = jQuery(this._el.nativeElement);
  }

  ngOnInit() {
    this._initializeTypeahead();
  }

  ngOnDestroy() {
    this.inputElement.typeahead('destroy');
  }

  private _initializeTypeahead() {
    let keywordsEngine = new Bloodhound({
      remote: {
        url: `${this.apiUrl}?format=json&${this.apiAttr}__icontains=%QUERY`,
        filter: (x: any) => {
          return jQuery.map(x.objects, (item) => {
            return item[this.apiAttr];
          });
        },
        wildcard: '%QUERY'
      },
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });

    keywordsEngine.initialize();

    this.inputElement.typeahead(
      {
        hint: false,
        highlight: true,
        minLength: this.minLength
      },
      {
        source: keywordsEngine,
        limit: RESULTS_LIMIT
      }
    );

    this.inputElement.bind('typeahead:selected', (ev, suggestion) => {
      this.onSelected.emit(suggestion);
    });
  }

}
