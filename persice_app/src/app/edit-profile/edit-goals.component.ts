import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ManageGoalsOffersComponent } from '../../common/manage-goals-offers';
import { AutocompleteDirective, InfiniteScrollElementDirective } from '../../common/directives';
import { LoadingComponent } from '../shared/components/loading';
import { EditFooterComponent } from './edit-footer.component';
import { GoalsService } from '../shared/services';

@Component({
  selector: 'prs-edit-goals',
  template: <any>require('./edit-goals.html'),
  directives: [
    LoadingComponent,
    EditFooterComponent,
    AutocompleteDirective,
    InfiniteScrollElementDirective
  ],
  providers: [
    GoalsService
  ]
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
