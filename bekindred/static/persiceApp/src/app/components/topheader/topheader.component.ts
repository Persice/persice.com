/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

import {SearchComponent} from '../search/search.component';
import {ProfileDropdownComponent} from '../profiledropdown/profiledropdown.component';
import {ToggleFilterDirective} from '../../directives/togglefilter.directive';

let view = require('./topheader.html');
@Component({
  selector: 'top-header',
  properties: ['image']
})
@View({
  directives: [SearchComponent, ProfileDropdownComponent, ToggleFilterDirective],
  template: view
})
export class TopHeaderComponent {
  image: string;
  constructor() {
  }
}
