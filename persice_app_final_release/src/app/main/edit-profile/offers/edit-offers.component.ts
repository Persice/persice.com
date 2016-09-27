import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { OffersService } from '../../../../common/services/offers.service';
import { ManageGoalsOffersComponent } from '../../../../common/manage-goals-offers/manage-goals-offers.component';

@Component({
  selector: 'prs-edit-offers',
  templateUrl: './edit-offers.html',
  providers: [
    OffersService
  ]
})
export class EditOffersComponent extends ManageGoalsOffersComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(
    protected offersService: OffersService
  ) {
    super(offersService);
  }

  ngOnInit() {
    this.getList();
  }
}
