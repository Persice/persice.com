import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ManageInterestsComponent } from '../../common/manage-interests';
import { LoadingComponent } from '../shared/components/loading';
import { EditFooterComponent } from './edit-footer.component';
import { AutocompleteDirective, InfiniteScrollElementDirective } from '../../common/directives';
import { InterestsService, KeywordsService } from '../shared/services';

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
