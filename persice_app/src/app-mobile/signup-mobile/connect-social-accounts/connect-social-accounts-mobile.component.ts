import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../../app/shared/services';

@Component({
  selector: 'prs-connect-social-accounts',
  template: <any>require('./connect-social-accounts-mobile.html')
})
export class SignupConnectSocialAccountsMobileComponent implements OnInit {

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

  constructor(private service: UserAuthService) {
  }

  ngOnInit() {
    this.getConnectStatus();
  }

  /**
   * Skip to crowd page
   * @param {DOM event} click event
   */
  skip(event) {
    window.location.href = '/crowd/';
  }

  getConnectStatus() {
    this.connectStatus = this.service.getConnectStatus();
  }

  toggle(provider) {
    if (this.connectStatus[provider].connected) {
      this.disconnect(provider);
    } else {
      this.connect(provider);
    }
  }

  connect(provider) {
    let url = '/social/associate/' + provider + '/?next=/signup/connect/';
    window.location.href = url;
  }

  disconnect(provider) {
    let url = '/social/disconnect/' + provider + '/?next=/signup/connect/';
    window.location.href = url;
  }

  openUrl(provider) {
    if (this.connectStatus[provider].connected) {
      let win = window.open(this.connectStatus[provider].url, '_blank');
      win.focus();
    }
  }
}
