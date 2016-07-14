import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ManageGoalsOffersComponent } from '../../common/manage-goals-offers';
import { AutocompleteDirective, InfiniteScrollElementDirective } from '../../common/directives';
import { LoadingComponent } from '../shared/components/loading';
import { EditFooterComponent } from './edit-footer.component';
import { OffersService } from '../shared/services';

@Component({
  selector: 'prs-edit-offers',
  template: <any>require('./edit-offers.html'),
  directives: [
    LoadingComponent,
    EditFooterComponent,
    AutocompleteDirective,
    InfiniteScrollElementDirective
  ],
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
