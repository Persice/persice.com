import {Component, OnInit} from '@angular/core';
import {AppStateService} from "../../shared/services/app-state.service";
import {CookieUtil} from "../../../app/shared/core/util";
import {PoliticalViewsService} from "../../../app/shared/services/politicalviews.service";
import {HeaderState} from '../../header';

@Component({
  selector: 'prs-mobile-political-views',
  template: <any>require('./political-views-mobile.html'),
  providers: [PoliticalViewsService],
})
export class PoliticalViewsMobileComponent implements OnInit {

  private usernameFromCookie: string;
  private politicalViews: any[];

  constructor(
    private appStateService: AppStateService,
    private politicalViewsService: PoliticalViewsService,
    private headerState: HeaderState
  ) {
    this.usernameFromCookie = CookieUtil.getValue('user_username');
    this.politicalViewsService.getAllPoliticalViewsWithStatus();
  }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backDoneWithTitle('political views', HeaderState.actions.EditPersonalInfo)
    );
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
