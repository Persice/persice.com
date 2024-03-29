import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../../common/login/login.component';
import { OnboardingService } from '../../common/services/onboarding.service';
import { AuthService } from '../../common/auth/auth.service';

@Component({
  selector: 'prs-login',
  providers: [ OnboardingService ],
  templateUrl: './login-desktop.html'
})
export class LoginDesktopComponent extends LoginComponent implements OnInit {
  constructor(protected router: Router, protected auth: AuthService, protected service: OnboardingService, protected cd: ChangeDetectorRef) {
    super(router, auth, service, cd);
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.onInit();
  }

}
