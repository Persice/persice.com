import { Component, Input } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { Auth } from '../../common/auth/auth';
import { IntercomUtil } from '../../common/core/util';

@Component({
  selector: 'prs-mobile-navigation',
  template: <any>require('./navigation-mobile.html'),
  directives: [ROUTER_DIRECTIVES]
})
export class NavigationMobileComponent {
  @Input() username: string;
  @Input() unreadMessagesCounter: number;
  @Input() newConnectionsCounter: number;

  constructor(private router: Router, private auth: Auth) { }

  public logout(event: MouseEvent) {
    this.auth.logout().subscribe(() => {
      IntercomUtil.shutdown();
      this.router.navigateByUrl('/login');
    });
  }
}
