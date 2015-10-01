/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

let view = require('./profiledropdown.html');

@Component({
  selector: 'profile-dropdown'
})
@View({
  directives: [],
  template: view
})
export class ProfileDropdownComponent {
  constructor() {

  }
}
