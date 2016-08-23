import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../common/ng2-ui-auth/auth';
import { LoginComponent } from '../../common/login/login.component';
import { OnboardingService } from '../../app/shared/services/onboarding.service';

@Component({
  selector: 'prs-login-mobile',
  template: <any>require('./login-mobile.html'),
  providers: [OnboardingService]
})
export class LoginMobileComponent extends LoginComponent implements OnInit {
  constructor(protected router: Router, protected auth: Auth, protected service: OnboardingService) {
    super(router, auth, service);
  }

  ngOnInit() {
    window.scroll(0, 0);
  }

}
