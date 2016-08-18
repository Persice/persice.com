import { Component, OnInit } from '@angular/core';
import { ManageInterestsComponent } from '../../../common/manage-interests';
import { InterestsService, KeywordsService } from '../../../app/shared/services';
import { SignupStateService } from '../../../common/services';
import { LoadingComponent } from '../../../app/shared/components/loading';
import { AutocompleteDirective, InfiniteScrollElementDirective } from '../../../common/directives';

@Component({
  selector: 'persice-mobile-signup-interests',
  template: <any>require('./interests-mobile.html'),
  directives: [
    LoadingComponent,
    AutocompleteDirective,
    InfiniteScrollElementDirective
  ]
})
export class SignupInterestsMobileComponent extends ManageInterestsComponent implements OnInit {

  constructor(
    protected interestsService: InterestsService,
    protected keywordsService: KeywordsService,
    private signupStateService: SignupStateService
  ) {
    super(interestsService, keywordsService);
  }

  ngOnInit() {
    this.getList();
  }

  afterCounterChanged() {
    this.signupStateService.counterEmitter.emit({
      type: 'interests',
      count: this.counter
    });
  }

}
