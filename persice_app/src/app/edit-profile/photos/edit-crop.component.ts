import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {CropDirective} from '../../shared/directives/crop.directive';

@Component({
  selector: 'prs-edit-crop',
  template: <any>require('./edit-crop.html'),
  directives: [CropDirective]
})
export class EditCropComponent implements OnChanges {
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() cropAndSave: EventEmitter<any> = new EventEmitter();
  @Input() isHidden: boolean;
  @Input() image;

  private croppedImage;
  private imageUri: string = '';
  private loading: boolean = false;
  private croppieOptions = JSON.stringify({
    viewport: {
      width: 200,
      height: 200
    },
    boundary: {
      width: 630,
      height: 340
    }
  });

  ngOnChanges(values) {
    if (values.image && values.image.currentValue) {
      this.imageUri = values.image.currentValue.images[0].source;
    }
  }

  savePhoto(event) {
    this.cropAndSave.emit({
      cropped: this.croppedImage,
      original: this.imageUri
    });
  }
}
