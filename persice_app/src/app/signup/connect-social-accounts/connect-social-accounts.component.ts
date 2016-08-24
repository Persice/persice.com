import { Component, NgZone, OnInit } from '@angular/core';
import { UserAuthService } from '../../shared/services';

@Component({
  selector: 'prs-signup-connect',
  template: <any>require('./connect-social-accounts.html')
})
export class SignupConnectSocialAccountsComponent implements OnInit {

  connectStatus = {
    twitter: {
      connected: false,
      username: 'Your twitter account',
      url: ''
    },
    linkedin: {
      connected: false,
      username: 'Your linkedin account',
      url: ''
    }
  };

  constructor(private service: UserAuthService, private _ngZone: NgZone) { }

  ngOnInit() {
    this.getConnectStatus();
    jQuery('.connect-media').on('persice:refreshConnect', (e) => {
      this.refreshConnectInfo();
    });
  }

  refreshConnectInfo() {
    this.service.findOneByUri('me').subscribe((data) => {
      this.getConnectStatus();
    });
  }

  getConnectStatus() {
    this._ngZone.run(() => {
      this.connectStatus = this.service.getConnectStatus();
    });
  }

  toggle(provider) {
    if (this.connectStatus[provider].connected) {
      this.disconnect(provider);
    } else {
      this.connect(provider);
    }
  }

  connect(provider) {
    let w = 400;
    let h = 300;

    let dualScreenLeft = window.screenLeft;
    let dualScreenTop = window.screenTop;

    let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    let left = ((width / 2) - (w / 2)) + dualScreenLeft;
    let top = ((height / 2) - (h / 2)) + dualScreenTop;

    let settings = 'height=' + h + ',width=' + w + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=yes,directories=no,status=yes';
    let url = '/social/associate/' + provider + '/?next=/goals/close_login_popup/';
    let newWindow = window.open(url, `Connecting your ${provider} account...`, settings);

    if (window.focus) {
      newWindow.focus();
    }
  }

  disconnect(provider) {
    let w = 400;
    let h = 300;

    let dualScreenLeft = window.screenLeft;
    let dualScreenTop = window.screenTop;

    let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    let left = ((width / 2) - (w / 2)) + dualScreenLeft;
    let top = ((height / 2) - (h / 2)) + dualScreenTop;

    let settings = 'height=' + h + ',width=' + w + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=yes,directories=no,status=yes';
    let url = '/social/disconnect/' + provider + '/?next=/goals/close_login_popup/';
    let newWindow = window.open(url, `Disconnecting your ${provider} account...`, settings);

    if (window.focus) {
      newWindow.focus();
    }
  }

  openUrl(provider) {
    if (this.connectStatus[provider].connected) {
      let win = window.open(this.connectStatus[provider].url, '_blank');
      win.focus();
    }
  }
}
