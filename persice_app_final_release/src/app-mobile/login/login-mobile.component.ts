import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginComponent } from '../../common/login/login.component';
import { Http, Headers } from '@angular/http';
import { OnboardingService } from '../../common/services/onboarding.service';
import { AuthService } from '../../common/auth/auth.service';

const REDIRECT_URI = SERVER_URI + '/login';

@Component({
  selector: 'prs-login-mobile',
  templateUrl: './login-mobile.html',
  providers: [ OnboardingService ]
})
export class LoginMobileComponent extends LoginComponent implements OnInit, OnDestroy {

  private code: string = null;
  private routerSub;

  constructor(
    protected router: Router,
    protected auth: AuthService,
    protected service: OnboardingService,
    protected cd: ChangeDetectorRef,
    private http: Http,
    private route: ActivatedRoute
  ) {
    super(router, auth, service, cd);
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.onInit();
    if (!this.isCordova) {
      this.routerSub = this.route
        .queryParams
        .subscribe(params => {
          this.code = params[ 'code' ] || null;
          if (!!this.code) {
            this.login(this.code);
          }
        });
    }

  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  public authenticate(provider: string) {

    if (this.isCordova) {
      this.isInfoVisible = true;
      this.isLoading = true;
      this.message = LoginComponent.MESSAGE_POPUP_OPENED;
      this.auth.authenticate(provider)
        .subscribe((res) => {
          this.checkOnboardingAndRedirect();
        }, (err) => {
          console.log('err', err);
          this.isInfoVisible = true;
          this.isLoading = false;
          this.message = LoginComponent.MESSAGE_LOGIN_ERROR;
          this.cd.detectChanges();
        });

    } else {
      let redirectUri =  REDIRECT_URI;
      let facebookAppId = FACEBOOK_ID;
      let scope = FACEBOOK_SCOPE;
      let facebookOauth: string = `https://www.facebook.com/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
      window.location.href = facebookOauth;
    }
  }

  private login(code: string) {
    let options = { headers: new Headers() };
    options.headers.set('Content-Type', 'application/json');
    this.isInfoVisible = true;
    this.isLoading = true;
    this.message = LoginComponent.MESSAGE_LOGIN_IN_PROGRESS;
    let data: any = {
      code: code,
      redirectUri: REDIRECT_URI,
      responseParams: { clientId: 'clientId', code: 'code', redirectUri: 'redirectUri' },
      responseType: 'code'
    };

    this.http.post('/api/v2/accounts/facebook/login/?format=json', JSON.stringify(data), options)
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
