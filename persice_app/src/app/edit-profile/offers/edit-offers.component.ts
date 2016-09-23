import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { EditFooterComponent } from '../footer/edit-footer.component';
import { AutocompleteDirective } from '../../../common/directives/autocomplete.directive';
import { InfiniteScrollElementDirective } from '../../../common/directives/infinite-scroll-element.directive';
import { OffersService } from '../../shared/services/offers.service';
import { ManageGoalsOffersComponent } from '../../../common/manage-goals-offers/manage-goals-offers.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

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
