import { Component, OnInit } from '@angular/core';
import { SocialAccountsComponent } from '../../../common/social-accounts/social-accounts.component';
import { Router } from '@angular/router';
import { UserAuthService } from '../../../common/services/userauth.service';
import { AuthService } from '../../../common/auth/auth.service';

@Component({
  selector: 'prs-connect-social-accounts',
  templateUrl: './connect-social-accounts-mobile.html'
})
export class SignupConnectSocialAccountsMobileComponent extends SocialAccountsComponent implements OnInit {

  constructor(protected service: UserAuthService, protected auth: AuthService, private router: Router) {
    super(service, auth);
  }

  ngOnInit() {
    this.onInit();
  }

  public skip(event: MouseEvent) {
    this.router.navigateByUrl('/crowd');
  }

}
