import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../common/ng2-ui-auth/auth';
import { LoginComponent } from '../../common/login/login.component';
import { OnboardingService } from '../shared/services/onboarding.service';

@Component({
  selector: 'prs-login',
  template: <any>require('./login-desktop.html'),
  providers: [OnboardingService]
})
export class LoginDesktopComponent extends LoginComponent {
  constructor(protected router: Router, protected auth: Auth, protected service: OnboardingService) {
    super(router, auth, service);
  }

}
