import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../common/auth/auth.service';
import { TokenUtil, IntercomUtil } from '../../../common/core/util';

@Component({
  selector: 'prs-dropdown',
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent {
  @Input() image;

  constructor(private router: Router, private auth: AuthService) {
    this.router = router;
  }

  public openMyProfile(event: MouseEvent) {
    setTimeout(() => jQuery('#profileDropdown').removeClass('is-active'));
    this.router.navigateByUrl('/' + TokenUtil.getValue('username'));
  }

  public logout(event: MouseEvent) {
    this.auth.logout().subscribe(() => {
      IntercomUtil.shutdown();
      this.router.navigateByUrl('/login');
    });

  }
}
