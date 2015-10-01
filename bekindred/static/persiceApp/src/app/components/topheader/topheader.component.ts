/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

import {SearchComponent} from '../search/search.component';
import {ProfileDropdownComponent} from '../profiledropdown/profiledropdown.component';

let view = require('./topheader.html');
@Component({
  selector: 'top-header'
})
@View({
  directives: [SearchComponent, ProfileDropdownComponent],
  template: view
})
export class TopHeaderComponent {
  constructor() {

  }
}
