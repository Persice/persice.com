import { Component, OnInit } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';
import { AppStateService } from '../../shared/services';
import { UserAuthService } from '../../../app/shared/services';
import { HeaderState } from '../../header';
import { SocialAccountsComponent } from '../../../common/social-accounts/social-accounts.component';
import { Auth } from '../../../common/auth/auth';

@Component({
  selector: 'prs-mobile-edit-social-accounts',
  template: <any>require('./edit-social-accounts-mobile.html'),
  providers: [UserAuthService]
})
export class EditSocialAccountsMobileComponent extends SocialAccountsComponent implements OnInit {

  constructor(
    protected service: UserAuthService,
    protected auth: Auth,
    private appStateService: AppStateService,
    private sanitizer: DomSanitizationService,
    private headerState: HeaderState
  ) {
    super(service, auth);
  }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backDoneWithTitle('accounts', HeaderState.actions.EditMyProfile)
    );
    this.onInit();
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
