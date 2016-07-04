import {Component, OnInit} from '@angular/core';

import {ManageGoalsOffersComponent} from '../../common/manage-goals-offers';

import {OffersService} from '../../app/shared/services';
import {SignupStateService} from '../../common/services';
import {AutocompleteDirective, InfiniteScrollElementDirective} from '../../common/directives';
import {LoadingComponent} from '../../app/shared/components/loading';

@Component({
  selector: 'prs-signup-offers',
  template: <any>require('./signup-offers.html'),
  directives: [
    LoadingComponent,
    AutocompleteDirective,
    InfiniteScrollElementDirective
  ]
})
export class SignupOffersComponent extends ManageGoalsOffersComponent implements OnInit {
  constructor(
    protected offersService: OffersService,
    protected signupStateService: SignupStateService
  ) {
    super(offersService);
  }

  ngOnInit() {
    this.getList();
  }

  afterCounterChanged() {
    this.signupStateService.counterEmitter.emit({
      type: 'offers',
      count: this.total_count
    });
  }

}
