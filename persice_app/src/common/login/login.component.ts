import { Router } from '@angular/router';
import { Auth } from 'ng2-ui-auth';

export abstract class LoginComponent {
  constructor(protected router: Router, protected auth: Auth) {

  }

  public authenticate(provider: string) {
    this.auth.authenticate(provider)
      .subscribe((res) => {
        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 100);

      }, (err) => {});

  }

}
