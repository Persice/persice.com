import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../ng2-ui-auth/auth';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) { }

  canActivate() {
    // Check if user is authenticated (if auth token is valid)
    if (this.auth.isAuthenticated()) {
      return Observable.of(true);
    }

    //Redirect the user before denying them access to this route
    this.router.navigateByUrl('/login');
    return Observable.of(false);
  }

}
