import { Component, OnInit } from '@angular/core';
import { ManageGoalsOffersComponent } from '../../../common/manage-goals-offers';
import { SignupStateService } from '../../../common/services';
import { GoalsService } from '../../../common/services/goals.service';

@Component({
  selector: 'prs-mobile-goals',
  templateUrl: './goals-mobile.html',
})
export class SignupGoalsMobileComponent extends ManageGoalsOffersComponent implements OnInit {

  constructor(
    protected goalsService: GoalsService,
    protected signupStateService: SignupStateService
  ) {
    super(goalsService);
  }

  ngOnInit() {
    this.getList();
  }

  afterCounterChanged() {
    this.signupStateService.counterEmitter.emit({
      type: 'goals',
      count: this.total_count
    });
  }

}
