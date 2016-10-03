import { Component, OnInit, OnDestroy } from '@angular/core';
import { ManageInterestsComponent } from '../../../common/manage-interests';
import { SignupStateService } from '../../../common/services';
import { InterestsService } from '../../../common/services/interests.service';
import { KeywordsService } from '../../../common/services/keywords.service';
import { WarningService } from '../../../common/services/warning.service';

@Component({
  selector: 'prs-signup-interests',
  templateUrl: './signup-interests.html'
})
export class SignupInterestsComponent extends ManageInterestsComponent implements OnInit, OnDestroy {
  // Show warning message if at least three interests are not selected
  showWarning: boolean = false;

  warningServiceInstance;

  constructor(
    protected interestsService: InterestsService,
    protected keywordsService: KeywordsService,
    private signupStateService: SignupStateService,
    private warningService: WarningService
  ) {
    super(interestsService, keywordsService);
  }

  ngOnInit() {
    this.getList();
    this.warningServiceInstance = this.warningService.observer()
      .subscribe((event: any) => this.showWarning = event);
  }

  ngOnDestroy() {
    this.warningServiceInstance.unsubscribe();
  }

  afterCounterChanged() {
    this.signupStateService.counterEmitter.emit({
      type: 'interests',
      count: this.counter
    });
  }

}
