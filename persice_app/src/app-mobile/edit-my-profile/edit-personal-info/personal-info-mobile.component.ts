import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../app/shared/services/profile.service';
import { LoadingComponent } from '../../../app/shared/components/loading/loading.component';
import { Person } from '../../shared/model/person';
import { AppStateService } from '../../shared/services/app-state.service';
import { TokenUtil } from '../../../app/shared/core/util';
import { HeaderState } from '../../header';
import { EditAboutMobileComponent } from './edit-about';

@Component({
  selector: 'prs-mobile-personal-info',
  template: <any>require('./personal-info-mobile.html'),
  providers: [ProfileService],
  directives: [LoadingComponent, EditAboutMobileComponent]
})
export class PersonalInfoMobileComponent implements OnInit {

  private me: Person;
  private usernameFromToken: string;
  private isProfileLoaded: boolean = false;

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
