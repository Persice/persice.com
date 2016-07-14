import { Component, OnInit } from '@angular/core';
import { ManageGoalsOffersComponent } from '../../../common/manage-goals-offers/manage-goals-offers.component';
import { InfiniteScrollElementDirective } from '../../../common/directives/infinite-scroll-element.directive';
import { AutocompleteDirective } from '../../../common/directives/autocomplete.directive';
import { LoadingComponent } from '../../../app/shared/components/loading/loading.component';
import { OffersService } from '../../../app/shared/services/offers.service';
import { AppStateService } from '../../shared/services/app-state.service';
import { HeaderState } from '../../header';

@Component({
  selector: 'prs-mobile-offers',
  template: <any>require('./offers-mobile.html'),
  providers: [OffersService],
  directives: [
    LoadingComponent,
    AutocompleteDirective,
    InfiniteScrollElementDirective
  ]
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
