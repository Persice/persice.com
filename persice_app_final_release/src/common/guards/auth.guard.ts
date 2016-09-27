import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { IntercomUtil } from '../core/util';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate() {
    // Check if user is authenticated (if auth token is valid)
    if (this.auth.isAuthenticated()) {
      return Observable.of(true);
    }

    //Redirect the user before denying them access to this route
    this.router.navigateByUrl('/login');
    IntercomUtil.shutdown();
    return Observable.of(false);
  }

}
