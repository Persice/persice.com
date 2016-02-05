import {Component, Input, Output, ChangeDetectionStrategy} from 'angular2/core';
import {SortableDirective} from '../../directives/sortable.directive';
import {Http} from 'angular2/http';

import {ListUtil, CookieUtil} from '../../core/util';

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

  constructor(private _http: Http) {

  }

  ngOnInit() {
    let token = CookieUtil.getValue('user_token');
    let url = `https://graph.facebook.com/me/?fields=albums.limit(30){picture, name, photos.limit(6)}&access_token=${token}`;
    this._http.get(url).map(res => res.json())
    .subscribe((data) => {
      console.log('FB albums', data);
    });
  }

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
