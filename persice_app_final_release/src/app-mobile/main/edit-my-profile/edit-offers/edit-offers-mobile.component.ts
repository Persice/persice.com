import { Component, OnInit } from '@angular/core';
import { HeaderState } from '../../header';
import { OffersService } from '../../../../common/services/offers.service';
import { ManageGoalsOffersComponent } from '../../../../common/manage-goals-offers';
import { AppStateService } from '../../../shared/services';

@Component({
  selector: 'prs-mobile-offers',
  templateUrl: './offers-mobile.html',
  providers: [ OffersService ]
})
export class EditOffersMobileComponent extends ManageGoalsOffersComponent implements OnInit {

  constructor(
    protected offersService: OffersService,
    protected appStateService: AppStateService,
    private headerState: HeaderState
  ) {
    super(offersService);
  }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backDoneWithTitle('offers', HeaderState.actions.EditMyProfile)
    );
    this.getList();
  }
}
