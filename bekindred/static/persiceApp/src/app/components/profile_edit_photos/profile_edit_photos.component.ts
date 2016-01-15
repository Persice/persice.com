import {Component, Input, Output, ChangeDetectionStrategy} from 'angular2/core';


import {SortableDirective} from '../../directives/sortable.directive';

import {ListUtil} from '../../core/util';

let view = require('./profile_edit_photos.html');

@Component({
  selector: 'profile-edit-photos',
  template: view,
  directives: [
    SortableDirective
  ]
})
export class ProfileEditPhotosComponent {
  @Input() photos;
  @Input() default;
  profilePhotos = [];

  ngOnChanges(values) {
    if (values.photos && values.photos.currentValue) {
      this.assignPhotos(values.photos.currentValue);
    }
  }

  assignPhotos(photos) {
    this.profilePhotos = ListUtil.orderBy(photos, ['order'], ['asc']);
    if (this.profilePhotos.length === 1 || this.profilePhotos.length === 0) {
      this.profilePhotos = [{
        photo: this.default,
        order: 0
      }];
    }
  }
}
