import { Component, OnInit } from '@angular/core';
import { HeaderState } from '../../header';
import { ManageInterestsComponent } from '../../../../common/manage-interests';
import { InterestsService } from '../../../../common/services/interests.service';
import { KeywordsService } from '../../../../common/services/keywords.service';
import { AppStateService } from '../../../shared/services';

@Component({
  selector: 'persice-mobile-edit-interests',
  templateUrl: './edit-interests-mobile.html',
  providers: [ InterestsService, KeywordsService ]
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
