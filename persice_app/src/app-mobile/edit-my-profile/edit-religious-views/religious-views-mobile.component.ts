import {Component, OnInit, OnDestroy} from '@angular/core';
import {Person} from "../../shared/model/person";
import {LoadingComponent} from "../../../app/shared/components/loading/loading.component";
import {AppStateService} from "../../shared/services/app-state.service";
import {CookieUtil} from "../../../app/shared/core/util";

@Component({
  selector: 'prs-mobile-religious-views',
  template: require('./religious-views-mobile.html'),
  providers: [LoadingComponent],
})
export class ReligiousViewsMobileComponent implements OnInit, OnDestroy {

  private me: Person;
  private usernameFromCookie: string;
  private isProfileLoaded: boolean = true;

  constructor(
    private appStateService: AppStateService
  ) {
    this.usernameFromCookie = CookieUtil.getValue('user_username');
  }

  ngOnInit(): any {
    this.appStateService.setEditMyProfileState(
      {title: 'Religious views', isDoneButtonVisible: true});
  }

  private save():void {
  }

  ngOnDestroy(): any {
    this.appStateService.setHeaderVisibility(true);
  }
}
