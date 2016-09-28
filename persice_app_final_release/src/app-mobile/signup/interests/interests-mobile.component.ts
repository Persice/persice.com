import { Component, OnInit } from '@angular/core';
import { ManageInterestsComponent } from '../../../common/manage-interests';
import { SignupStateService } from '../../../common/services';
import { InterestsService } from '../../../common/services/interests.service';
import { KeywordsService } from '../../../common/services/keywords.service';

@Component({
  selector: 'persice-mobile-signup-interests',
  templateUrl: './interests-mobile.html',
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
