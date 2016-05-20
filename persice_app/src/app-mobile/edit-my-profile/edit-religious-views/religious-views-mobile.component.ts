import {Component, OnInit} from '@angular/core';
import {AppStateService} from "../../shared/services/app-state.service";
import {CookieUtil} from "../../../app/shared/core/util";
import {ReligiousViewsService} from "../../../app/shared/services/religiousviews.service";

@Component({
  selector: 'prs-mobile-religious-views',
  template: require('./religious-views-mobile.html'),
  providers: [ReligiousViewsService],
})
export class ReligiousViewsMobileComponent implements OnInit {

  private usernameFromCookie: string;
  private religiousViews: any[];

  constructor(
    private appStateService: AppStateService,
    private religiousViewsService: ReligiousViewsService
) {
    this.usernameFromCookie = CookieUtil.getValue('user_username');
    this.religiousViewsService.getAllReligiousViewsWithStatus();
  }

  ngOnInit():any {
    this.appStateService.setEditMyProfileState(
      {title: 'religious views', isDoneButtonVisible: true});
    this.religiousViewsService.emitter.subscribe((resp) => {
      this.religiousViews = resp;
    })
  }
}
