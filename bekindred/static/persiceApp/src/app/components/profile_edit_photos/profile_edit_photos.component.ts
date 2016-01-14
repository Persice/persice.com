import {Component, Input, Output, ChangeDetectionStrategy} from 'angular2/core';

let view = require('./profile_edit_photos.html');

@Component({
  selector: 'profile-edit-photo',
  template: view
})
export class ProfileEditPhotosComponent {
  @Input() photos;
}
