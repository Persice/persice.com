import {Component, Input, Output, EventEmitter} from 'angular2/core';


/**
 * Directives
 */
import {CropDirective} from '../../directives/crop.directive';

/**
 * Services
 */


@Component({
  selector: 'profile-edit-photos-crop',
  template: require('./profile_edit_photos_crop.html'),
  directives: [
    CropDirective
  ]
})
export class ProfileEditPhotosCropComponent {
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() cropAndSave: EventEmitter<any> = new EventEmitter();
  @Input() isHidden;
  @Input() image;

  croppedImage;

  loading: boolean = false;
  croppieOptions = JSON.stringify({
    viewport: {
      width: 200,
      height: 200
    },
    boundary: {
      width: 630,
      height: 340
    }
  });
  imageUri = '';

  ngOnChanges(values) {
    if (values.image && values.image.currentValue) {
      this.imageUri = values.image.currentValue.images[0].source;
    }
  }

  savePhoto(event) {

    this.cropAndSave.next({
      cropped: this.croppedImage,
      original: this.imageUri
    });
  }
}