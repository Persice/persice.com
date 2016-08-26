import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../common/auth/auth';
import { LoginComponent } from '../../common/login/login.component';
import { OnboardingService } from '../../app/shared/services/onboarding.service';
import { Http, Headers } from '@angular/http';

const REDIRECT_URI = window.location.origin + '/login';

@Component({
  selector: 'prs-login-mobile',
  template: <any>require('./login-mobile.html'),
  providers: [OnboardingService]
})
export class LoginMobileComponent extends LoginComponent implements OnInit, OnDestroy {

  private code: string = null;
  private routerSub;

  constructor(
    protected router: Router,
    protected auth: Auth,
    protected service: OnboardingService,
    private http: Http
  ) {
    super(router, auth, service);
  }

  ngOnInit() {
    window.scroll(0, 0);

    this.routerSub = this.router
      .routerState
      .queryParams
      .subscribe(params => {
        this.code = params['code'] || null;

        if (!!this.code) {
          this.login(this.code);
        }
      });

  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  public authenticate(provider: string) {
    let redirectUri = REDIRECT_URI;
    let facebookAppId = FACEBOOK_ID;
    let scope = FACEBOOK_SCOPE;
    let facebookOauth: string = `https://www.facebook.com/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    window.location.href = facebookOauth;
  }

  private login(code: string) {
    let options = {headers: new Headers()};
    options.headers.set('Content-Type', 'application/json');
    this.isInfoVisible = true;
    this.isLoading = true;
    this.message = LoginComponent.MESSAGE_LOGIN_IN_PROGRESS;
    let data: any = {
      code: code,
      redirectUri: REDIRECT_URI,
      responseParams: {clientId: 'clientId', code: 'code', redirectUri: 'redirectUri'},
      responseType: 'code'
    };

    this.http.post('/api/v2/accounts/facebook/login/', JSON.stringify(data), options)
      .subscribe((res: any) => {
        this.auth.setToken(res);
        this.checkOnboardingAndRedirect();
      }, (err) => {
        this.isInfoVisible = true;
        this.isLoading = false;
        this.message = LoginComponent.MESSAGE_LOGIN_ERROR;
      });
  }

}
