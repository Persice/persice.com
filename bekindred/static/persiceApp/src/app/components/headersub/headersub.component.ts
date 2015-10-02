/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

import {SearchComponent} from '../search/search.component';
import {ProfileDropdownComponent} from '../profiledropdown/profiledropdown.component';
import {ToggleFilterDirective} from '../../directives/togglefilter.directive';

let view = require('./headersub.html');
@Component({
  selector: 'header-sub',
  properties: ['image']
})
@View({
  directives: [SearchComponent, ProfileDropdownComponent, ToggleFilterDirective],
  template: view
})
export class HeaderSubComponent {
  image: string;
  constructor() {
  }
}
