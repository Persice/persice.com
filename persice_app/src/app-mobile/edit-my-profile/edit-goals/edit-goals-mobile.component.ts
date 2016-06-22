import {Component, OnInit} from '@angular/core';
import {ManageGoalsOffersComponent} from '../../../common/manage-goals-offers/manage-goals-offers.component';
import {InfiniteScrollElementDirective} from '../../../common/directives/infinite-scroll-element.directive';
import {AutocompleteDirective} from '../../../common/directives/autocomplete.directive';
import {LoadingComponent} from '../../../app/shared/components/loading/loading.component';
import {GoalsService} from '../../../app/shared/services/goals.service';
import {AppStateService} from '../../shared/services/app-state.service';
import {HeaderActions, LeftHeaderState, RightHeaderState, CenterHeaderState} from '../../header';

@Component({
  selector: 'prs-mobile-goals',
  template: require('./goals-mobile.html'),
  providers: [GoalsService],
  directives: [
    LoadingComponent,
    AutocompleteDirective,
    InfiniteScrollElementDirective
  ]
})
export class EditGoalsMobileComponent extends ManageGoalsOffersComponent implements OnInit {

  constructor(
    protected goalsService: GoalsService,
    protected appStateService: AppStateService
  ) {
    super(goalsService);
  }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit({
      left: LeftHeaderState.Back,
      leftAction: HeaderActions.EditMyProfile,
      center: CenterHeaderState.Title,
      right: RightHeaderState.Done,
      rightAction: HeaderActions.EditMyProfile,
      transparent: false,
      title: 'Goals'
    });
    this.getList();
  }
}
