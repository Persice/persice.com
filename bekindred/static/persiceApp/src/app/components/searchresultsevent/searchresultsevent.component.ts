import {Component} from 'angular2/core';

import {SearchResultEventModel} from '../../models/searchresults.model';
import {ImageStretchDirective} from '../../directives/imagestretch.directive';

let view = require('./searchresultsevent.html');

@Component({
  inputs: ['event'],
  selector: 'searchresult-event',
  template: view,
  directives: [ImageStretchDirective]
})
export class SearchResultsEventComponent {
  event: SearchResultEventModel;
}
