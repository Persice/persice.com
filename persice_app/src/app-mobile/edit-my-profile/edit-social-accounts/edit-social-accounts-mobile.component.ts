import {Component, OnInit} from '@angular/core';
import {DomSanitizationService} from '@angular/platform-browser';

import {AppStateService} from '../../shared/services';
import {UserAuthService} from '../../../app/shared/services';
import {HeaderState} from '../../header';

@Component({
  selector: 'prs-mobile-edit-social-accounts',
  template: require('./edit-social-accounts-mobile.html'),
  providers: [UserAuthService]
})
export class EditSocialAccountsMobileComponent implements OnInit {
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
  private username: string;

  constructor(
    private userAuthService: UserAuthService,
    private appStateService: AppStateService,
    private sanitizer: DomSanitizationService,
    private headerState: HeaderState
  ) {
  }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backDoneWithTitle('accounts', HeaderState.actions.EditMyProfile)
    );
    this.getConnectStatus();
  }

  /**
   * Get social accounts status testing
   */
  getConnectStatus() {
    this.userAuthService.findOneByUri('me').subscribe((data) => {
      this.connectStatus = this.userAuthService.getConnectStatus();
      this.username = data.username;
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
    let url = `/social/associate/${provider}/?next=/${this.username}/edit-profile/accounts`;
    window.location.href = url;
  }

  disconnect(provider) {
    let url = `/social/disconnect/${provider}/?next=/${this.username}/edit-profile/accounts`;
    window.location.href = url;
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
