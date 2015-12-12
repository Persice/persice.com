import {Component, CORE_DIRECTIVES, ElementRef, Inject} from 'angular2/angular2';
import {SearchKeywordsInputComponent} from '../searchkeywords/searchkeywordsinput.component';

declare var jQuery: any;

let view = require('./searchkeywords.html');
@Component({
  selector: 'search-keywords',
  directives: [CORE_DIRECTIVES, SearchKeywordsInputComponent],
  template: view
})
export class SearchKeywordsComponent {
  el: ElementRef;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

}
