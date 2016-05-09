import {Component, Input} from '@angular/core';
import {RouterLink, Router} from '@angular/router-deprecated';

import {DropdownDirective} from '../shared/directives/dropdown.directive';
import {CheckImageDirective} from '../shared/directives/checkimage.directive';

declare var jQuery;
@Component({
  selector: 'prs-dropdown',
  directives: [DropdownDirective, RouterLink, CheckImageDirective],
  template: `
  <div class="user-profile">
    <div class="user-profile__avatar">
      <div class="avatar-holder" checkimage="{{image}}" [suffix]="'.56x56_q100_crop.jpg'" [onchanges]="1">
      </div>
    </div>
    <div class="user-profile__arrow" dropdown="#profileDropdown">
      <svg role="img" class="icon">
        <use xlink:href="/static/assets/icons/icons.svg#icon-arrow_down"></use>
      </svg>
    </div>
    <div class="dropdown-basic" id="profileDropdown">
      <ul class="list-bare">
        <li><a (click)="openMyProfile($event)">My profile</a></li>
        <li><a >Settings</a></li>
        <li><a href="/signup/">Signup</a></li>
        <li><a href="/accounts/logout/">Logout</a></li>
      </ul>
    </div>
  </div>
`
})
export class DropdownComponent {
  @Input() image;

  constructor(private router: Router) {
    this.router = router;
  }

  openMyProfile() {
    this.router.navigate(['/ProfileMy']);
    jQuery('#profileDropdown').removeClass('is-active');
  }
}
