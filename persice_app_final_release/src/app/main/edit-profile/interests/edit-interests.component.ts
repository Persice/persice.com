import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { InterestsService } from '../../../../common/services/interests.service';
import { KeywordsService } from '../../../../common/services/keywords.service';
import { ManageInterestsComponent } from '../../../../common/manage-interests/manage-interests.component';

@Component({
  selector: 'prs-edit-interests',
  templateUrl: './edit-interests.html',
  providers: [
    InterestsService,
    KeywordsService
  ]
})
export class EditInterestsComponent extends ManageInterestsComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter;

  constructor(
    protected interestsService: InterestsService,
    protected keywordsService: KeywordsService
  ) {
    super(interestsService, keywordsService);
  }

  ngOnInit() {
    this.getList();
  }

}
