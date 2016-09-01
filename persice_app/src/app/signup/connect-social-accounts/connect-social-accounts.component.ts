import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../shared/services';
import { Auth } from '../../../common/auth';
import { SocialAccountsComponent } from '../../../common/social-accounts/social-accounts.component';

@Component({
  selector: 'prs-signup-connect',
  template: <any>require('./connect-social-accounts.html')
})
export class SignupConnectSocialAccountsComponent extends SocialAccountsComponent implements OnInit {

  constructor(protected service: UserAuthService, protected auth: Auth) {
    super(service, auth);
  }

  ngOnInit() {
    this.onInit();
  }

}
