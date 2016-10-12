import { Router } from '@angular/router';
import { OnboardingService } from '../services/onboarding.service';
import { AuthService } from '../auth/auth.service';
import { ChangeDetectorRef } from '@angular/core';

export abstract class LoginComponent {
  protected static MESSAGE_POPUP_OPENED = 'A Facebook pop-up window has opened, please follow the instructions to sign in.';
  protected static MESSAGE_LOGIN_IN_PROGRESS = 'Please wait. Logging you into Persice.'
  protected static MESSAGE_LOGIN_ERROR = 'Sorry, we couldn\'t log you in. Please try again.';
  protected static MESSAGE_LOGIN_SUCCESS = 'Please wait. Opening Persice...';

  public isInfoVisible: boolean = false;
  public isLoading: boolean = false;
  public message: string = '';
  public isCordova: boolean = 'enabled' === CORDOVA_BUILD ? true : false;

  constructor(
    protected router: Router,
    protected auth: AuthService,
    protected onboardingService: OnboardingService,
    protected cd: ChangeDetectorRef
  ) {

  }

  public onInit() {
    this.auth.isLoggingIn().subscribe((loginInProgress: boolean) => {
      if (!!loginInProgress) {
        this.message = LoginComponent.MESSAGE_LOGIN_IN_PROGRESS;
      }
    });
  }

  public authenticate(provider: string) {

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

  }

  public closeInfo(event: MouseEvent) {
    this.isInfoVisible = false;
    this.message = '';
  }

  protected checkOnboardingAndRedirect() {
    this.onboardingService.isOnboardingFinished()
      .subscribe((onboardingFinished: boolean) => {
        // this.message = LoginComponent.MESSAGE_LOGIN_SUCCESS;
        this.isLoading = true;
        if (!onboardingFinished) {
          this.router.navigateByUrl('/signup/interests');
        } else {
          this.router.navigateByUrl('/');
        }
      }, (err) => {
        this.message = LoginComponent.MESSAGE_LOGIN_ERROR;
        this.isLoading = false;
        this.router.navigateByUrl('/');
      });
  }

}
