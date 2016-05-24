import {Component} from '@angular/core';

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
export class EditPhotosMobileComponent {

  // Active page
  // 1 = edit and arrange photos,
  // 2 = choose facebook album
  // 3 = choose facebook photo from album
  // 4 = crop facebook photo and save
  public page: number = 1;

  private photos: Photo[] = [];
  private photosCount: number = 0;
  private loadingPhotos: boolean = false;


  constructor(private appStateService: AppStateService, private photosService: PhotosService) { }

  ngOnInit(): any {
    this._getProfilePhotos();

    this.appStateService.editPhotosStateEmitter.subscribe((state: any) => {
      if (typeof state.page !== undefined) {
        this.page = state.page;
      }

      if (state.refreshPhotos) {
        this._getProfilePhotos();
      }

      if (state.action === 'delete') {
        this.deletePhoto(state.uri);
      }
    });

    this.photosService.photosCounterEmitter.subscribe((data: number) => this.photosCount = data);

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
    this.photosService.getMyPhotosForEditing()
      .subscribe((photos: Photo[]) => {
        this.photos = photos;
        this.loadingPhotos = false;
      });
  }
}
