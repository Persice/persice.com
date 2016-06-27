import {Component, OnInit} from '@angular/core';
import {LoadingComponent} from "../../../app/shared/components/loading/loading.component";
import {AutocompleteDirective} from "../../../common/directives/autocomplete.directive";
import {KeywordsService} from "../../../app/shared/services/keywords.service";
import {InfiniteScrollElementDirective} from "../../../common/directives/infinite-scroll-element.directive";
import {InterestsService} from "../../../app/shared/services/interests.service";
import {ManageInterestsComponent} from "../../../common/manage-interests/manage-interests.component";
import {AppStateService} from "../../shared/services/app-state.service";
import {HeaderState} from '../../header';

@Component({
  selector: 'persice-mobile-edit-interests',
  template: require('./edit-interests-mobile.html'),
  directives: [
    LoadingComponent,
    AutocompleteDirective,
    InfiniteScrollElementDirective
  ],
  providers: [InterestsService, KeywordsService]
})
export class EditInterestsMobileComponent extends ManageInterestsComponent implements OnInit {
  constructor(
    protected interestsService: InterestsService,
    protected keywordsService: KeywordsService,
    private appStateService: AppStateService,
    private headerState: HeaderState
  ) {
    super(interestsService, keywordsService);
  }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit(this.headerState.backDoneWithTitle('interests', HeaderState.actions.EditMyProfile));
    this.getList();
  }

}
