import {Component, OnInit} from '@angular/core';

import {ManageGoalsOffersComponent} from '../../common/manage-goals-offers';
import {OffersService} from '../../app/shared/services';
import {SignupStateService} from '../../common/services';
import {LoadingComponent} from '../../app/shared/components/loading';
import {AutocompleteDirective, InfiniteScrollElementDirective} from '../../common/directives';

@Component({
  selector: 'prs-mobile-offers',
  template: <any>require('./offers-mobile.html'),
  directives: [
    LoadingComponent,
    AutocompleteDirective,
    InfiniteScrollElementDirective
  ]
})
export class SignupOffersMobileComponent extends ManageGoalsOffersComponent implements OnInit {

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
