import {Component, Input} from 'angular2/core';
import {RouterLink} from 'angular2/router';

let view = require('./profiledropdown.html');
@Component({
  selector: 'profile-dropdown',
  template: view,
  directives: [RouterLink]
})
export class ProfileDropdownComponent {
  @Input() image;

}
