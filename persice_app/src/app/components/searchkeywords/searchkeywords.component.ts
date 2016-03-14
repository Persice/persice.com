import {Component, ElementRef, Inject} from 'angular2/core';
import {SearchKeywordsInputComponent} from '../searchkeywords/searchkeywordsinput.component';

declare var jQuery: any;

let view = require('./searchkeywords.html');
@Component({
  selector: 'search-keywords',
  directives: [SearchKeywordsInputComponent],
  template: view
})
export class SearchKeywordsComponent {
  el: ElementRef;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

}
