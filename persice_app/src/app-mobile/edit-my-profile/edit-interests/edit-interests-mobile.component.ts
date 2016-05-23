import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {LoadingComponent} from "../../../app/shared/components/loading/loading.component";
import {AutocompleteDirective} from "../../../common/directives/autocomplete.directive";
import {KeywordsService} from "../../../app/shared/services/keywords.service";
import {InfiniteScrollElementDirective} from "../../../common/directives/infinite-scroll-element.directive";
import {InterestsService} from "../../../app/shared/services/interests.service";
import {ManageInterestsComponent} from "../../../common/manage-interests/manage-interests.component";
import {AppStateService} from "../../shared/services/app-state.service";


@Component({
  selector: 'persice-mobile-edit-interests',
  template: require('./edit-interests-mobile.html'),
  directives: [
    LoadingComponent,
    AutocompleteDirective,
    InfiniteScrollElementDirective,
    RouterLink
  ],
  providers: [InterestsService, KeywordsService]
})
export class EditInterestsMobileComponent extends ManageInterestsComponent implements OnInit {
  constructor(
    protected interestsService: InterestsService,
    protected keywordsService: KeywordsService,
    private appStateService: AppStateService
  ) {
    super(interestsService, keywordsService);
  }

  ngOnInit() {
    this.getList();
    this.appStateService.setEditMyProfileState({title: 'interests', isDoneButtonVisible: true});
  }

}
