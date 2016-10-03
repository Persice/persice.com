import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { GoalsService } from '../../../../common/services/goals.service';
import { ManageGoalsOffersComponent } from '../../../../common/manage-goals-offers/manage-goals-offers.component';

@Component({
  selector: 'prs-edit-goals',
  templateUrl: './edit-goals.html',
  providers: [ GoalsService ]
})
export class EditGoalsComponent extends ManageGoalsOffersComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(
    protected goalsService: GoalsService
  ) {
    super(goalsService);
  }

  ngOnInit() {
    this.getList();
  }
}
