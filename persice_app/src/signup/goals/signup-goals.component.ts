import {Component, OnInit} from '@angular/core';

import {ManageGoalsOffersComponent} from '../../common/manage-goals-offers';

import {GoalsService} from '../../app/shared/services';
import {SignupStateService} from '../../common/services';
import {AutocompleteDirective, InfiniteScrollElementDirective} from '../../common/directives';
import {LoadingComponent} from '../../app/shared/components/loading';

@Component({
  selector: 'prs-signup-goals',
  template: require('./signup-goals.html'),
  directives: [
    LoadingComponent,
    AutocompleteDirective,
    InfiniteScrollElementDirective
  ]
})
export class SignupGoalsComponent extends ManageGoalsOffersComponent implements OnInit {
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
