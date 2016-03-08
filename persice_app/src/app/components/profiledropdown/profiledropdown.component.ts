import {Component} from 'angular2/core';
import {RouterLink, Router} from 'angular2/router';

import {DropdownDirective} from '../../directives/dropdown.directive';

let view = require('./profiledropdown.html');
declare var jQuery;
@Component({
  selector: 'profile-dropdown',
  inputs: ['image'],
  template: view,
  directives: [DropdownDirective, RouterLink]
})
export class ProfileDropdownComponent {
  constructor(private router: Router) {
    this.router = router;
  }

  openMyProfile() {
    this.router.navigate(['/ProfileMy']);
    jQuery('#profileDropdown').removeClass('is-active');
  }
}