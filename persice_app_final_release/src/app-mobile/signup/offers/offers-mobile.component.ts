import { Component, OnInit } from '@angular/core';
import { ManageGoalsOffersComponent } from '../../../common/manage-goals-offers';
import { SignupStateService } from '../../../common/services';
import { OffersService } from '../../../common/services/offers.service';

@Component({
  selector: 'prs-mobile-offers',
  templateUrl: './offers-mobile.html'
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
