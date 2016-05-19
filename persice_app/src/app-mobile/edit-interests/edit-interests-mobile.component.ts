import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {ManageInterestsComponent} from '../../common/manage-interests';

import {InterestsService, KeywordsService} from '../../app/shared/services';
import {AppStateService} from '../shared/services';
import {LoadingComponent} from '../../app/shared/components/loading';
import {AutocompleteDirective, InfiniteScrollElementDirective} from '../../common/directives';

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
export class EditInterestsMobileComponent extends ManageInterestsComponent implements OnInit, OnDestroy {
  constructor(
    protected interestsService: InterestsService,
    protected keywordsService: KeywordsService,
    private appStateService: AppStateService
  ) {
    super(interestsService, keywordsService);
  }

  ngOnInit() {
    this.getList();
    this.appStateService.setHeaderVisibility(false);
  }

  ngOnDestroy() {
    this.appStateService.setHeaderVisibility(true);
  }

}
