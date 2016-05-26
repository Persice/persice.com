import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {AppStateService} from '../../../shared/services/app-state.service';
import {CropDirective} from '../../../../app/shared/directives';

@Component({
  selector: 'prs-mobile-crop-photo',
  template: require('./crop-photo.html'),
  directives: [CropDirective]
})
export class CropPhotoComponent implements OnInit {

  @Input() set photo (data: any) {
    if (!!data.images && data.images.length > 0) {
      this._imageUri = data.images[0].source;
    }
  };

  @Output() onPhotoCropped: EventEmitter<any> = new EventEmitter();

  public set croppedImage(data: any) {
    this._croppedImage = data;
    this.onPhotoCropped.next({
      cropped: data,
      original: this._imageUri,
      order: null
    });
  };

  public croppieOptions = JSON.stringify({
    enableZoom: true,
    viewport: {
      width: 250,
      height: 250
    },
    boundary: {
      height: 410
    }
  });

  private _imageUri: string = '';
  private _croppedImage: any;

  constructor(private appStateService: AppStateService) { }

  ngOnInit(): any {
    this.appStateService.setEditMyProfileState({
      title: 'crop photo',
      isDoneButtonVisible: false,
      isCroppingPhotosDoneButtonVisible: true
    });
  }

}
