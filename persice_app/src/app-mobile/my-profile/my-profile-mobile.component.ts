import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {Person} from "../shared/model/person";
import {ProfileService} from "../../app/shared/services/profile.service";
import {UserProfileComponent} from "../user-profile/user-profile.component";
import {CookieUtil} from "../../app/shared/core/util";
import {AppStateService} from '../shared/services';

@Component({
  selector: 'prs-mobile-my-profile',
  template: require('./my-profile-mobile.html'),
  providers: [ProfileService],
  directives: [UserProfileComponent]
})
export class MyProfileMobileComponent implements OnInit, OnDestroy {

  private me: Person;
  private usernameFromCookie: string;
  private usernameFromUrl: string;
  private isProfileLoaded: boolean = false;

  constructor(
    private profileService: ProfileService,
    private _params: RouteParams,
    private appStateService:AppStateService
  ) {
    this.usernameFromCookie = CookieUtil.getValue('user_username');
    this.usernameFromUrl = _params.get('username');
  }

  ngOnInit(): any {
    this.profileService.ofUsername(this.usernameFromCookie).subscribe(resp => {
      this.me = resp;
      this.isProfileLoaded = true;
      this.appStateService.setHeaderVisibility(false);
    });
  }

  ngOnDestroy(): any {
    this.appStateService.setHeaderVisibility(true);
  }
}
