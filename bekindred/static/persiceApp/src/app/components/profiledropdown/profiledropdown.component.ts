import {Component, NgStyle} from 'angular2/angular2';

import {DropdownDirective} from '../../directives/dropdown.directive';

let view = require('./profiledropdown.html');

@Component({
  selector: 'profile-dropdown',
  inputs: ['image'],
  template: view,
  directives: [DropdownDirective, NgStyle]
})
export class ProfileDropdownComponent {

}
