import {Component, OnInit} from '@angular/core';

import {AppStateService} from '../../shared/services/app-state.service';
import {PhotosService} from '../../../app/shared/services';
import {Photo} from '../../../common/models/photo';
import {ArrangePhotosComponent} from './arrange-photos';
import {ChooseAlbumComponent} from './choose-album';
import {ChoosePhotoComponent} from './choose-photo';
import {CropPhotoComponent} from './crop-photo';
import {LoadingComponent} from '../../../app/shared/components/loading';

@Component({
  selector: 'prs-mobile-edit-photos',
  template: require('./edit-photos-mobile.html'),
  directives: [
    ArrangePhotosComponent,
    ChooseAlbumComponent,
    ChoosePhotoComponent,
    CropPhotoComponent,
    LoadingComponent
  ],
  providers: [PhotosService]
})
export class EditPhotosMobileComponent implements OnInit {
  public static EDIT_PHOTOS_LIMIT: number = 5;

  // Active page
  // 1 = edit and arrange photos,
  // 2 = choose facebook album
  // 3 = choose facebook photo from album
  // 4 = crop facebook photo and save
  public page: number = 1;

  public photos: Photo[] = [];
  public photosCount: number = 0;
  public loadingPhotos: boolean = false;


  constructor(private appStateService: AppStateService, private photosService: PhotosService) { }

  ngOnInit(): any {
    this._getProfilePhotos();

    this.appStateService.editPhotosStateEmitter.subscribe((state: any) => {
      if (!!state.page) {
        this.page = state.page;
      }
      if (!!state.refreshPhotos) {
        this._getProfilePhotos();
      }
    });
  }

  deletePhoto(uri: string) {
    this.photosService.delete(uri, (status) => {
      if (status === 1) {
        this._getProfilePhotos();
      }
    });
  }

  private _getProfilePhotos() {
    if (this.loadingPhotos) {
      return;
    }
    this.loadingPhotos = true;
    this.photosService.getMyPhotos(EditPhotosMobileComponent.EDIT_PHOTOS_LIMIT)
      .subscribe((dtoJson: any) => {
        this.photos = PhotosService.getEditPhotos(dtoJson, EditPhotosMobileComponent.EDIT_PHOTOS_LIMIT);
        this.photosCount = PhotosService.getEditPhotosCount(dtoJson);
        this.loadingPhotos = false;
      });
  }


}
