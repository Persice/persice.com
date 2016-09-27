import { Component, OnInit } from '@angular/core';
import { SocialAccountsComponent } from '../../../common/social-accounts/social-accounts.component';
import { UserAuthService } from '../../../common/services/userauth.service';
import { AuthService } from '../../../common/auth/auth.service';

@Component({
  selector: 'prs-signup-connect',
  templateUrl: './connect-social-accounts.html'
})
export class SignupConnectSocialAccountsComponent extends SocialAccountsComponent implements OnInit {

  constructor(protected service: UserAuthService, protected auth: AuthService) {
    super(service, auth);
  }

  ngOnInit() {
    this.onInit();
  }

}
