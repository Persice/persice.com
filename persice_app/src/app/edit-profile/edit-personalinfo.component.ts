import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  AfterViewInit
} from '@angular/core';

import {ListUtil} from '../shared/core';
import {GenderPipe} from '../shared/pipes';

import {EditAboutComponent} from './edit-about.component';
import {EditFooterComponent} from './edit-footer.component';


import {ReligiousViewsService, PoliticalViewsService} from '../shared/services';




@Component({
  selector: 'prs-edit-personalinfo',
  template: <any>require('./edit-personalinfo.html'),
  directives: [
    EditAboutComponent,
    EditFooterComponent
  ],
  pipes: [
    GenderPipe
  ],
  providers: [
    ReligiousViewsService,
    PoliticalViewsService
  ]
})
export class EditPersonalInfoComponent implements OnChanges, AfterViewInit {
  @Input() user;
  @Input() politicalViews;
  @Input() religiousViews;
  @Output() close: EventEmitter<any> = new EventEmitter;

  loading: boolean = false;

  politicalList = [];
  religiousList = [];

  politicalListSelected = [];
  religiousListSelected = [];

  constructor(
    private politicalService: PoliticalViewsService,
    private religiousService: ReligiousViewsService
  ) {
  }

  ngOnChanges(values) {
    if (values.politicalViews && values.politicalViews.currentValue) {
      this.politicalList = values.politicalViews.currentValue;
      this.politicalListSelected = ListUtil.filter(this.politicalList, 'selected', true);
    }

    if (values.religiousViews && values.religiousViews.currentValue) {
      this.religiousList = values.religiousViews.currentValue;
      this.religiousListSelected = ListUtil.filter(this.religiousList, 'selected', true);

    }
  }

  ngAfterViewInit() {
    //Reselect
    jQuery('.js-reselect__trigger').on('click', function(e) {
      e.preventDefault();
      jQuery('.js-reselect__drop').addClass('is-hidden');
      jQuery(this)
        .closest('.reselect')
        .find('.js-reselect__drop')
        .removeClass('is-hidden');
    });

    jQuery('.js-reselect__done').on('click', function() {
      jQuery('.js-reselect__drop').addClass('is-hidden');
    });

  }

  toggle(item) {
    let itemList = `${item.list}List`;
    let itemListSelected = `${item.list}ListSelected`;
    let itemService = `${item.list}Service`;
    let idx = item.idx;
    this.loading = true;
    if (this[itemList][idx].selected) {
      this[itemService].delete(this[itemList][idx].view_uri)
        .subscribe((data) => {
          this[itemList][idx].selected = false;
          this.loading = false;
          this[itemListSelected] = ListUtil.filter(this[itemList], 'selected', true);
        });
    } else {
      this[itemService].create(this[itemList][idx].name)
        .subscribe((data) => {
          this[itemList][idx].selected = true;
          this[itemList][idx].view_uri = data.resource_uri;
          this.loading = false;
          this[itemListSelected] = ListUtil.filter(this[itemList], 'selected', true);
        });
    }
  }
}
