import {Component} from 'angular2/core';

import {GenderPipe} from '../../pipes/gender.pipe';
import {SearchResultUserModel} from '../../models/searchresults.model';
import {ImageStretchDirective} from '../../directives/imagestretch.directive';

let view = require('./searchresultsuser.html');

@Component({
  inputs: ['user'],
  selector: 'searchresult-user',
  pipes: [GenderPipe],
  template: view,
  directives: [ImageStretchDirective]
})
export class SearchResultsUserComponent {
  user: SearchResultUserModel;

}
