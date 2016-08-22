import { Router } from '@angular/router';
import { Auth } from '../ng2-ui-auth/auth';

export abstract class LoginComponent {
  constructor(protected router: Router, protected auth: Auth) {

  }

  public authenticate(provider: string) {
    this.auth.authenticate(provider)
      .subscribe((res) => {
        console.log('login res', res);
        this.router.navigateByUrl('/');
      }, (err) => {
        console.log('error', err);
      });
  }

}
