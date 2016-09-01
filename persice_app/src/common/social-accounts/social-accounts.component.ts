import { UserAuthService } from '../../app/shared/services/userauth.service';
import { Auth } from '../auth/auth';
export abstract class SocialAccountsComponent {
  protected static MESSAGE_CONNECT_POPUP_OPENED = 'A pop-up window has opened, please follow the instructions to sign in.';
  protected static MESSAGE_CONNECT_IN_PROGRESS = 'Please wait while we connect your account.';
  protected static MESSAGE_CONNECT_ERROR = 'Sorry, we couldn\'t connect your account. Please try again.';

  public isInfoVisible: boolean = false;
  public isLoading: boolean = false;
  public message: string = '';

  public connectStatus = {
    twitter: {
      connected: false,
      username: 'Your twitter account',
      url: ''
    },
    linkedin: {
      connected: false,
      username: 'Your linkedin account',
      url: ''
    },
    facebook: {
      connected: true,
      username: '',
      url: ''
    }
  };

  constructor(protected service: UserAuthService, protected auth: Auth) { }

  public refreshConnectInfo() {
    this.service.findOneByUri('me').subscribe((data) => {
      this.getConnectStatus();
    });
  }

  public getConnectStatus() {
    this.connectStatus = this.service.getConnectStatus();
  }

  public toggle(provider) {
    if (this.connectStatus[provider].connected) {
      this.disconnect(provider);
    } else {
      this.connect(provider);
    }
  }

  public connect(provider) {
    this.isInfoVisible = true;
    this.isLoading = true;
    this.message = SocialAccountsComponent.MESSAGE_CONNECT_POPUP_OPENED;
    this.auth.authenticate(provider).subscribe((res) => {
      this.closeInfo(undefined);
      this.refreshConnectInfo();
    }, (err) => {
      this.isLoading = false;
      this.message = SocialAccountsComponent.MESSAGE_CONNECT_ERROR;
      console.log('connect error', err);
    });

  }

  public disconnect(provider) {
    this.auth.unlink(provider, {}).subscribe((res) => {
      this.refreshConnectInfo();
    }, (err) => {
      console.log('disconnect error', err);
    });
  }

  public openUrl(provider) {
    if (this.connectStatus[provider].connected) {
      let win = window.open(this.connectStatus[provider].url, '_blank');
      win.focus();
    }
  }

  public closeInfo(event: MouseEvent) {
    this.isInfoVisible = false;
    this.isLoading = false;
    this.message = '';
  }

  protected onInit() {
    this.getConnectStatus();
    this.auth.isLoggingIn().subscribe((loginInProgress: boolean) => {
      if (!!loginInProgress) {
        this.message = SocialAccountsComponent.MESSAGE_CONNECT_IN_PROGRESS;
      }
    });

  }

}
