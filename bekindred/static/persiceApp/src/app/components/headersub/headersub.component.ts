import {Component} from 'angular2/core';

import {SearchKeywordsComponent} from '../searchkeywords/searchkeywords.component';
import {ProfileDropdownComponent} from '../profiledropdown/profiledropdown.component';
import {ToggleFilterDirective} from '../../directives/togglefilter.directive';

let view = require('./headersub.html');
@Component({
  selector: 'header-sub',
  inputs: ['image'],
  directives: [
    ProfileDropdownComponent,
    ToggleFilterDirective,
    SearchKeywordsComponent
  ],
  template: view
})
export class HeaderSubComponent {
  image: string;
}
