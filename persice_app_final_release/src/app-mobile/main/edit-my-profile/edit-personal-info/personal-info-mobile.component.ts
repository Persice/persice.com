import { Component, OnInit } from '@angular/core';
import { HeaderState } from '../../header';
import { ProfileService } from '../../../../common/services/profile.service';
import { Person } from '../../../../common/models/person';
import { AppStateService } from '../../../shared/services';
import { TokenUtil } from '../../../../common/core';

@Component({
  selector: 'prs-mobile-personal-info',
  templateUrl: './personal-info-mobile.html',
  providers: [ ProfileService ],
})
export class PersonalInfoMobileComponent implements OnInit {

  public me: Person;
  public usernameFromToken: string;
  public isProfileLoaded: boolean = false;

  constructor(
    private profileService: ProfileService,
    private appStateService: AppStateService,
    private headerState: HeaderState
  ) {
    this.usernameFromToken = TokenUtil.getValue('username');
  }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backDoneWithTitle('Personal Info', HeaderState.actions.EditMyProfile)
    );

    this.profileService.ofUsername(this.usernameFromToken).subscribe(resp => {
      this.me = new Person(resp);
      this.isProfileLoaded = true;
    });

  }

  public save(value: string): void {
    this.me.about = value;
    this.profileService.updateAboutMe(this.me.about).subscribe(() => {
    });
  }

}
