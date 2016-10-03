import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'prs-edit-crop',
  templateUrl: './edit-crop.html'
})
export class EditCropComponent implements OnChanges {
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() cropAndSave: EventEmitter<any> = new EventEmitter();
  @Input() isHidden: boolean;
  @Input() image;

  croppedImage;
  imageUri: string = '';
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

  ngOnChanges(values) {
    if (values.image && values.image.currentValue) {
      this.imageUri = values.image.currentValue.images[ 0 ].source;
    }
  }

  savePhoto(event) {
    this.cropAndSave.emit({
      cropped: this.croppedImage,
      original: this.imageUri
    });
  }
}
