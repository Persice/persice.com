import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HeaderState } from '../../../header';
import { AppStateService } from '../../../../shared/services';

@Component({
  selector: 'prs-mobile-crop-photo',
  templateUrl: './crop-photo.html',
})
export class CropPhotoComponent implements OnInit {

  @Input() set photo(data: any) {
    if (!!data.images && data.images.length > 0) {
      this._imageUri = <any>data.images[ 2 ].source;
    }
  };

  @Output() onPhotoCropped: EventEmitter<any> = new EventEmitter();

  public set croppedImage(data: any) {
    this._croppedImage = data;
    this.onPhotoCropped.emit({
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

  public _imageUri: string = '';
  private _croppedImage: any;

  constructor(
    private appStateService: AppStateService,
    private headerState: HeaderState
  ) { }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backDoneWithTitleAndActions(
        'crop photo',
        HeaderState.actions.ChoosePhoto,
        HeaderState.actions.SaveCroppedPhoto
      )
    );
  }

}
