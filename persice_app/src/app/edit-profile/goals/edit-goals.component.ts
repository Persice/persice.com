import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { EditFooterComponent } from '../footer/edit-footer.component';
import { AutocompleteDirective } from '../../../common/directives/autocomplete.directive';
import { InfiniteScrollElementDirective } from '../../../common/directives/infinite-scroll-element.directive';
import { GoalsService } from '../../shared/services/goals.service';
import { ManageGoalsOffersComponent } from '../../../common/manage-goals-offers/manage-goals-offers.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

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
