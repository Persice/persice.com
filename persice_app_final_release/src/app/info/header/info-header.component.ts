import { Component } from '@angular/core';
import { AuthService } from '../../../common/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'prs-info-header',
  templateUrl: './info-header.html',
  providers: [ AuthService ]
})
export class InfoHeaderComponent {

  constructor(private auth: AuthService, private router: Router) { }

  goBack(event: MouseEvent) {
    if (!!this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/events/all/list');
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
