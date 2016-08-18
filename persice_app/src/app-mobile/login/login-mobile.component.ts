import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'ng2-ui-auth';
import { LoginComponent } from '../../common/login/login.component';

@Component({
  selector: 'prs-login-mobile',
  template: <any>require('./login-mobile.html')
})
export class LoginMobileComponent extends LoginComponent {
  constructor(protected router: Router, protected auth: Auth) {
    super(router, auth);
  }

}
