import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../../app/shared/services';
import { Auth } from '../../../common/auth/auth';
import { SocialAccountsComponent } from '../../../common/social-accounts/social-accounts.component';
import { Router } from '@angular/router';

@Component({
  selector: 'prs-connect-social-accounts',
  template: <any>require('./connect-social-accounts-mobile.html')
})
export class SignupConnectSocialAccountsMobileComponent extends SocialAccountsComponent implements OnInit {

  constructor(protected service: UserAuthService, protected auth: Auth, private router: Router) {
    super(service, auth);
  }

  ngOnInit() {
    this.onInit();
  }

  public skip(event: MouseEvent) {
    this.router.navigateByUrl('/crowd');
  }

}
