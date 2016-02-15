import {Component, Input, Output, EventEmitter} from 'angular2/core';

/**
 * Components
 */
import {ProfileEditFooterComponent} from '../profile_edit_footer/profile_edit_footer.component';

/**
 * Services
 */

let view = require('./profile_edit_photos.html');

@Component({
  selector: 'profile-edit-photos',
  template: view,
  directives: [
    ProfileEditFooterComponent
  ]
})
export class ProfileEditPhotosComponent {
  @Input() photos;
  @Input() default;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() openAlbums: EventEmitter<any> = new EventEmitter();
  loading: boolean = false;
  profilePhotos = [];

  ngOnChanges(values) {
    if (values.photos && values.photos.currentValue) {
      this.assignPhotos(values.photos.currentValue);
    }
  }

  deletePhoto(photo) {
    this.delete.next(photo);
  }

  assignPhotos(photos) {
    this.profilePhotos = [
      {
        cropped_photo: '',
        id: null,
        order: 0,
        photo: '',
        resource_uri: '',
        user: ''
      },
      {
        cropped_photo: '',
        id: null,
        order: 1,
        photo: '',
        resource_uri: '',
        user: ''
      },
      {
        cropped_photo: '',
        id: null,
        order: 2,
        photo: '',
        resource_uri: '',
        user: ''
      },
      {
        cropped_photo: '',
        id: null,
        order: 3,
        photo: '',
        resource_uri: '',
        user: ''
      },
      {
        cropped_photo: '',
        id: null,
        order: 4,
        photo: '',
        resource_uri: '',
        user: ''
      },
    ];
    for (var i = 0; i < photos.length; ++i) {
      for (var j = 0; j < this.profilePhotos.length; ++j) {
        if (photos[i].order === this.profilePhotos[j].order) {
          this.profilePhotos[j] = photos[i];
        }
      }

    }
  }
}
