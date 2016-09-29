import { Component, OnInit } from '@angular/core';
import { HeaderState } from '../../header';
import { GoalsService } from '../../../../common/services/goals.service';
import { ManageGoalsOffersComponent } from '../../../../common/manage-goals-offers';
import { AppStateService } from '../../../shared/services';

@Component({
  selector: 'prs-mobile-goals',
  templateUrl: './goals-mobile.html',
  providers: [ GoalsService ]
})
export class EditGoalsMobileComponent extends ManageGoalsOffersComponent implements OnInit {

  constructor(
    protected goalsService: GoalsService,
    protected appStateService: AppStateService,
    private headerState: HeaderState
  ) {
    super(goalsService);
  }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backDoneWithTitle('goals', HeaderState.actions.EditMyProfile)
    );
    this.getList();
  }
}
