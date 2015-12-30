import {Component} from 'angular2/core';

import {SearchComponent} from '../search/search.component';
import {SearchKeywordsComponent} from '../searchkeywords/searchkeywords.component';
import {ProfileDropdownComponent} from '../profiledropdown/profiledropdown.component';
import {ToggleFilterDirective} from '../../directives/togglefilter.directive';

let view = require('./headersub.html');
@Component({
  selector: 'header-sub',
  inputs: ['image'],
  directives: [
    SearchComponent,
    ProfileDropdownComponent,
    ToggleFilterDirective,
    SearchKeywordsComponent
  ],
  template: view
})
export class HeaderSubComponent {
  image: string;
}
