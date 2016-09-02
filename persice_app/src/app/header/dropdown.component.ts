import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DropdownDirective } from '../shared/directives/dropdown.directive';
import { CheckImageDirective } from '../shared/directives/checkimage.directive';
import { TokenUtil } from '../../common/core';
import { Auth } from '../../common/auth/auth';

@Component({
  selector: 'prs-dropdown',
  directives: [DropdownDirective, CheckImageDirective],
  template: `
  <div class="user-profile" dropdown="#profileDropdown">
    <div class="user-profile__avatar">
      <div class="avatar-holder" checkimage="{{image}}" [suffix]="'.56x56_q100_crop.jpg'" [onchanges]="1">
      </div>
    </div>
    <div class="user-profile__arrow">
      <svg role="img" class="icon">
        <use xlink:href="/assets/icons/icons.svg#icon-arrow_down"></use>
      </svg>
    </div>
    <div class="dropdown-basic" id="profileDropdown">
      <ul class="list-bare">
        <li><a (click)="openMyProfile($event)">My profile</a></li>
        <li><a (click)="logout($event)">Logout</a></li>
      </ul>
    </div>
  </div>
`
})
export class DropdownComponent {
  @Input() image;

  constructor(private router: Router, private auth: Auth) {
    this.router = router;
  }

  public openMyProfile(event: MouseEvent) {
    setTimeout(() => jQuery('#profileDropdown').removeClass('is-active'));
    this.router.navigateByUrl('/' + TokenUtil.getValue('username'));
  }

  public logout(event: MouseEvent) {
    this.auth.logout().subscribe(() => {
      (<any>window).Intercom('shutdown');
      this.router.navigateByUrl('/login');
    });

  }
}
