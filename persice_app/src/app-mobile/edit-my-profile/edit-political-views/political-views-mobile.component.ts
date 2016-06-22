import {Component, OnInit} from '@angular/core';
import {AppStateService} from "../../shared/services/app-state.service";
import {CookieUtil} from "../../../app/shared/core/util";
import {PoliticalViewsService} from "../../../app/shared/services/politicalviews.service";
import {HeaderActions, LeftHeaderState, RightHeaderState, CenterHeaderState} from '../../header';

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

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit({
      left: LeftHeaderState.Back,
      leftAction: HeaderActions.EditPersonalInfo,
      center: CenterHeaderState.Title,
      right: RightHeaderState.Done,
      rightAction: HeaderActions.EditPersonalInfo,
      transparent: false,
      title: 'Political Views'
    });
    this.politicalViewsService.emitter.subscribe((resp) => {
      this.politicalViews = resp;
    });
  }

  public create(item: any) {
    this.politicalViewsService.create(item.name).subscribe((resp) => {
      item.view_url = resp.resource_uri;
      item.selected = !item.selected;
    });
  }

  public delete(item: any) {
    this.politicalViewsService.delete(item.view_url).subscribe(() => {
      item.selected = !item.selected;
    });
  }

  public toggleState(item: any) {
    if (!item.selected) {
      this.create(item);
    } else {
      this.delete(item);
    }
  }
}
