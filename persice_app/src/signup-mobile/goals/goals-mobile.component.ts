import { Component, OnInit } from '@angular/core';
import { ManageGoalsOffersComponent } from '../../common/manage-goals-offers';
import { GoalsService } from '../../app/shared/services';
import { SignupStateService } from '../../common/services';
import { LoadingComponent } from '../../app/shared/components/loading';
import { AutocompleteDirective, InfiniteScrollElementDirective } from '../../common/directives';

@Component({
  selector: 'prs-mobile-goals',
  template: <any>require('./goals-mobile.html'),
  directives: [
    LoadingComponent,
    AutocompleteDirective,
    InfiniteScrollElementDirective
  ]
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
