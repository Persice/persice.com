import {Component, Input, Output, ChangeDetectionStrategy, EventEmitter} from 'angular2/core';
import {ListUtil} from '../../core/util';
import {GenderPipe} from '../../pipes/gender.pipe';

import {AboutEditComponent} from './profile_edit_about.component';
//** Services */
import {ReligiousViewsService} from '../../services/religiousviews.service';
import {PoliticalViewsService} from '../../services/politicalviews.service';

declare var jQuery: any;

let view = require('./profile_edit_personalinfo.html');

@Component({
  selector: 'profile-edit-personal-info',
  template: view,
  directives: [
    AboutEditComponent
  ],
  pipes: [
    GenderPipe
  ],
  providers: [
    ReligiousViewsService,
    PoliticalViewsService
  ]
})
export class ProfileEditPersonalInfoComponent {
  @Input() user;
  @Input() politicalViews;
  @Input() religiousViews;
  @Output() loading: EventEmitter<any> = new EventEmitter;


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
    this.loading.next(true);
    if (this[itemList][idx].selected) {
      this[itemService].delete(this[itemList][idx].view_uri)
        .subscribe((data) => {
          this[itemList][idx].selected = false;
          this.loading.next(false);
          this[itemListSelected] = ListUtil.filter(this[itemList], 'selected', true);
        });
    }
    else {
      this[itemService].create(this[itemList][idx].name)
        .subscribe((data) => {
          this[itemList][idx].selected = true;
          this[itemList][idx].view_uri = data.resource_uri;
          this.loading.next(false);
          this[itemListSelected] = ListUtil.filter(this[itemList], 'selected', true);
        });
    }
  }
}
