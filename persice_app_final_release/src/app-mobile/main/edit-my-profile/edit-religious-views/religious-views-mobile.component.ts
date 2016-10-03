import { Component, OnInit } from '@angular/core';
import { HeaderState } from '../../header';
import { ReligiousViewsService } from '../../../../common/services/religiousviews.service';
import { AppStateService } from '../../../shared/services';
import { TokenUtil } from '../../../../common/core';

@Component({
  selector: 'prs-mobile-religious-views',
  templateUrl: './religious-views-mobile.html',
  providers: [ ReligiousViewsService ],
})
export class ReligiousViewsMobileComponent implements OnInit {

  public religiousViews: any[];
  private usernameFromToken: string;

  constructor(
    private appStateService: AppStateService,
    private religiousViewsService: ReligiousViewsService,
    private headerState: HeaderState
  ) {
    this.usernameFromToken = TokenUtil.getValue('username');
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
