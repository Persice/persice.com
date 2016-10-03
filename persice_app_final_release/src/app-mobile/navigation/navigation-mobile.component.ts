import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IntercomUtil } from '../../common/core/util';
import { AuthService } from '../../common/auth/auth.service';

@Component({
  selector: 'prs-mobile-navigation',
  templateUrl: './navigation-mobile.html'
})
export class NavigationMobileComponent {
  @Input() username: string;
  @Input() unreadMessagesCounter: number;
  @Input() newConnectionsCounter: number;

  constructor(private router: Router, private auth: AuthService) { }

  public logout(event: MouseEvent) {
    this.auth.logout().subscribe(() => {
      IntercomUtil.shutdown();
      this.router.navigateByUrl('/login');
    });
  }
}
