import {Component, OnInit} from '@angular/core';
import {ManageGoalsOffersComponent} from '../../../common/manage-goals-offers/manage-goals-offers.component';
import {InfiniteScrollElementDirective} from '../../../common/directives/infinite-scroll-element.directive';
import {AutocompleteDirective} from '../../../common/directives/autocomplete.directive';
import {LoadingComponent} from '../../../app/shared/components/loading/loading.component';
import {OffersService} from '../../../app/shared/services/offers.service';
import {AppStateService} from '../../shared/services/app-state.service';
import {HeaderActions, LeftHeaderState, RightHeaderState, CenterHeaderState} from '../../header';

@Component({
  selector: 'prs-mobile-offers',
  template: require('./offers-mobile.html'),
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
    protected appStateService: AppStateService
  ) {
    super(offersService);
  }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit({
      leftAction: HeaderActions.EditMyProfile,
      center: CenterHeaderState.Title,
      right: RightHeaderState.Done,
      rightAction: HeaderActions.EditMyProfile,
      transparent: false,
      title: 'Offers'
    });
    this.getList();
  }
}
