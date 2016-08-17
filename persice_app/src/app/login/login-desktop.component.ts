import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'ng2-ui-auth';

@Component({
  selector: 'prs-login',
  template: <any>require('./login-desktop.html')
})
export class LoginDesktopComponent {
  constructor(private router: Router, private auth: Auth) {

  }

  public authenticate(provider: string) {
    this.auth.authenticate(provider)
      .subscribe((res) => {
        console.log('User authenticated successfully: ', res.json());
        this.router.navigateByUrl('/crowd');
      });
  }

}
