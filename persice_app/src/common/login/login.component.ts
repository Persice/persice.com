import { Router } from '@angular/router';
import { Auth } from '../ng2-ui-auth/auth';
import { OnboardingService } from '../../app/shared/services/onboarding.service';

const MESSAGE_POPUP_OPENED = 'A Facebook pop-up window has opened, please follow the instructions to sign in.';
const MESSAGE_LOGIN_IN_PROGRESS = 'Please wait. Logging you into Persice.'
const MESSAGE_LOGIN_ERROR = 'Sorry, we couldn\'t log you in. Please try again.';
const MESSAGE_LOGIN_SUCCESS = 'Login to Persice is successfull.';

export abstract class LoginComponent {
  public isInfoVisible: boolean = false;
  public isLoading: boolean = false;
  public message: string = '';

  constructor(protected router: Router, protected auth: Auth, protected onboardingService: OnboardingService) {

    this.auth.isLoggingIn().subscribe((loginInProgress: boolean) => {
      if (!!loginInProgress) {
        this.message = MESSAGE_LOGIN_IN_PROGRESS;
      }
    });

  }

  public authenticate(provider: string) {
    this.isInfoVisible = true;
    this.isLoading = true;
    this.message = MESSAGE_POPUP_OPENED;
    this.auth.authenticate(provider)
      .subscribe((res) => {
        this.message = MESSAGE_LOGIN_SUCCESS;
        this.isLoading = false;
        this.checkOnboardingAndRedirect();
      }, (err) => {
        this.isInfoVisible = true;
        this.isLoading = false;
        this.message = MESSAGE_LOGIN_ERROR;
      });
  }

  public closeInfo(event: MouseEvent) {
    this.isInfoVisible = false;
    this.message = '';
  }

  private checkOnboardingAndRedirect() {
    this.onboardingService.isOnboardingFinished()
      .subscribe((onboardingFinished: boolean) => {
        if (!onboardingFinished) {
          this.router.navigateByUrl('/signup');
        } else {
          this.router.navigateByUrl('/');
        }
      });
  }

}
