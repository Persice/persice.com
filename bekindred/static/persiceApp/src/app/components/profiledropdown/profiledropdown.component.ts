import {Component} from 'angular2/core';

import {DropdownDirective} from '../../directives/dropdown.directive';

let view = require('./profiledropdown.html');

@Component({
  selector: 'profile-dropdown',
  inputs: ['image'],
  template: view,
  directives: [DropdownDirective]
})
export class ProfileDropdownComponent {

}
