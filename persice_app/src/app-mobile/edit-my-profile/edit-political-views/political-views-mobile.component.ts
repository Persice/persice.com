import {Component, OnInit} from '@angular/core';
import {AppStateService} from "../../shared/services/app-state.service";
import {CookieUtil} from "../../../app/shared/core/util";
import {PoliticalViewsService} from "../../../app/shared/services/politicalviews.service";

@Component({
  selector: 'prs-mobile-political-views',
  template: require('./political-views-mobile.html'),
  providers: [PoliticalViewsService],
})
export class PoliticalViewsMobileComponent implements OnInit {

  private usernameFromCookie: string;
  private politicalViews: any[];

  constructor(
    private appStateService: AppStateService,
    private politicalViewsService: PoliticalViewsService
) {
    this.usernameFromCookie = CookieUtil.getValue('user_username');
    this.politicalViewsService.getAllPoliticalViewsWithStatus();
  }

  ngOnInit():any {
    this.appStateService.setEditMyProfileState(
      {title: 'political views', isDoneButtonVisible: true});
    this.politicalViewsService.emitter.subscribe((resp) => {
      this.politicalViews = resp;
    })
  }
}
