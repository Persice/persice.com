import { Router } from '@angular/router';
import { Auth } from '../auth/auth';
import { OnboardingService } from '../../app/shared/services/onboarding.service';



export abstract class LoginComponent {
  protected static MESSAGE_POPUP_OPENED = 'A Facebook pop-up window has opened, please follow the instructions to sign in.';
  protected static MESSAGE_LOGIN_IN_PROGRESS = 'Please wait. Logging you into Persice.'
  protected static MESSAGE_LOGIN_ERROR = 'Sorry, we couldn\'t log you in. Please try again.';
  protected static MESSAGE_LOGIN_SUCCESS = 'Login to Persice is successfull.';

  public isInfoVisible: boolean = false;
  public isLoading: boolean = false;
  public message: string = '';

  constructor(protected router: Router, protected auth: Auth, protected onboardingService: OnboardingService) {

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
        this.isInfoVisible = true;
        this.isLoading = false;
        this.message = LoginComponent.MESSAGE_LOGIN_ERROR;
      });
  }

  public closeInfo(event: MouseEvent) {
    this.isInfoVisible = false;
    this.message = '';
  }

  protected checkOnboardingAndRedirect() {
    this.onboardingService.isOnboardingFinished()
      .subscribe((onboardingFinished: boolean) => {
        this.message = LoginComponent.MESSAGE_LOGIN_SUCCESS;
        this.isLoading = false;
        if (!onboardingFinished) {
          this.router.navigateByUrl('/signup');
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
