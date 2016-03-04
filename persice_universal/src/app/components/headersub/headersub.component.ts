import {Component, Input} from 'angular2/core';

import {ProfileDropdownComponent} from '../profiledropdown/profiledropdown.component';

let view = require('./headersub.html');
@Component({
  selector: 'header-sub',
  directives: [
    ProfileDropdownComponent
  ],
  template: view
})
export class HeaderSubComponent {
  @Input() image: string;
}
