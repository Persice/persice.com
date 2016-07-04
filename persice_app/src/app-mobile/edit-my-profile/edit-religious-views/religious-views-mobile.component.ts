import {Component, OnInit} from '@angular/core';
import {AppStateService} from "../../shared/services/app-state.service";
import {CookieUtil} from "../../../app/shared/core/util";
import {ReligiousViewsService} from "../../../app/shared/services/religiousviews.service";
import {HeaderState} from '../../header';

@Component({
  selector: 'prs-mobile-religious-views',
  template: <any>require('./religious-views-mobile.html'),
  providers: [ReligiousViewsService],
})
export class ReligiousViewsMobileComponent implements OnInit {

  private usernameFromCookie: string;
  private religiousViews: any[];

  constructor(
    private appStateService: AppStateService,
    private religiousViewsService: ReligiousViewsService,
    private headerState: HeaderState
  ) {
    this.usernameFromCookie = CookieUtil.getValue('user_username');
    this.religiousViewsService.getAllReligiousViewsWithStatus();
  }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backDoneWithTitle('religious views', HeaderState.actions.EditPersonalInfo)
    );
    this.religiousViewsService.emitter.subscribe((resp) => {
      this.religiousViews = resp;
    });
  }

  public create(item: any) {
    this.religiousViewsService.create(item.name).subscribe((resp) => {
      item.view_url = resp.resource_uri;
      item.selected = !item.selected;
    });
  }

  public delete(item: any) {
    this.religiousViewsService.delete(item.view_url).subscribe(() => {
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
