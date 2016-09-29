import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HeaderState } from '../../header';
import { AuthService } from '../../../../common/auth/auth.service';
import { UserAuthService } from '../../../../common/services/userauth.service';
import { SocialAccountsComponent } from '../../../../common/social-accounts/social-accounts.component';
import { AppStateService } from '../../../shared/services';

@Component({
  selector: 'prs-mobile-edit-social-accounts',
  templateUrl: './edit-social-accounts-mobile.html',
  providers: [ UserAuthService ]
})
export class EditSocialAccountsMobileComponent extends SocialAccountsComponent implements OnInit {

  constructor(
    protected service: UserAuthService,
    protected auth: AuthService,
    private appStateService: AppStateService,
    private sanitizer: DomSanitizer,
    private headerState: HeaderState
  ) {
    super(service, auth);
  }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backDoneWithTitle('accounts', HeaderState.actions.EditMyProfile)
    );
    this.onInit();
    this.refreshConnectInfo();
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
