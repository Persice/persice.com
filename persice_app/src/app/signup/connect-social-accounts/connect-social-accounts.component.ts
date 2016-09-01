import { Component, NgZone, OnInit } from '@angular/core';
import { UserAuthService } from '../../shared/services';
import { Auth } from '../../../common/auth';

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

  constructor(private service: UserAuthService, private _ngZone: NgZone, private auth: Auth) { }

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

    this.auth.authenticate(provider).subscribe((res) => {
      console.log(res);
      this.refreshConnectInfo();
    }, (err) => {
      console.log('connect error', err);
    });

  }

  disconnect(provider) {
      this.auth.unlink(provider, {}).subscribe((res) => {
      console.log(res);
      this.refreshConnectInfo();
    }, (err) => {
      console.log('disconnect error', err);
    });
  }

  openUrl(provider) {
    if (this.connectStatus[provider].connected) {
      let win = window.open(this.connectStatus[provider].url, '_blank');
      win.focus();
    }
  }
}
