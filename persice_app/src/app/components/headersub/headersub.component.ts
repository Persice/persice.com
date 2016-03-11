import {Component} from 'angular2/core';

import {SearchKeywordsComponent} from '../searchkeywords/searchkeywords.component';
import {ProfileDropdownComponent} from '../profiledropdown/profiledropdown.component';

let view = require('./headersub.html');
@Component({
  selector: 'header-sub',
  inputs: ['image'],
  directives: [
    ProfileDropdownComponent,
    SearchKeywordsComponent
  ],
  template: view
})
export class HeaderSubComponent {
  image: string;
}
