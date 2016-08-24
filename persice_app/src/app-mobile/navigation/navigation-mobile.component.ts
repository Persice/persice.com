import { Component, Input } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { Auth } from '../../common/auth/auth';

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
      this.router.navigateByUrl('/login');
    });
  }
}
