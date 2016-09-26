import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { EditFooterComponent } from '../footer/edit-footer.component';
import { AutocompleteDirective } from '../../../common/directives/autocomplete.directive';
import { InfiniteScrollElementDirective } from '../../../common/directives/infinite-scroll-element.directive';
import { InterestsService } from '../../shared/services/interests.service';
import { KeywordsService } from '../../shared/services/keywords.service';
import { ManageInterestsComponent} from '../../../common/manage-interests/manage-interests.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'prs-edit-interests',
  template: <any>require('./edit-interests.html'),
  directives: [
    LoadingComponent,
    EditFooterComponent,
    AutocompleteDirective,
    InfiniteScrollElementDirective
  ],
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
