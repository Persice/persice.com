import {Component, OnInit, OnDestroy} from '@angular/core';

import {AppStateService} from '../../shared/services/app-state.service';
import {PhotosService, FacebookAlbumsService} from '../../../app/shared/services';
import {Photo} from '../../../common/models/photo';
import {ArrangePhotosComponent} from './arrange-photos';
import {ChooseAlbumComponent} from './choose-album';
import {ChoosePhotoComponent} from './choose-photo';
import {CropPhotoComponent} from './crop-photo';

@Component({
  selector: 'prs-mobile-edit-photos',
  template: require('./edit-photos-mobile.html'),
  directives: [
    ArrangePhotosComponent,
    ChooseAlbumComponent,
    ChoosePhotoComponent,
    CropPhotoComponent
  ],
  providers: [PhotosService, FacebookAlbumsService]
})
export class EditPhotosMobileComponent implements OnInit, OnDestroy {
  public static EDIT_PHOTOS_LIMIT: number = 5;

  // Active page
  // 1 = Edit and arrange photos,
  // 2 = Choose facebook album
  // 3 = Choose facebook photo from album
  // 4 = Crop facebook photo and save
  public page: number = 1;

  public photos: Photo[] = [];
  public photosCount: number = 0;
  public loadingPhotos: boolean = false;

  // Collection for managing Facebook albums and photos
  public albums = [];

  // Loading indicators for Facebook albums and photos
  public loadingFBAlbums: boolean = false;
  public loadingFBPhotos: boolean = false;

  public nextAlbumUrl: string = null;
  public nextPhotosUrl: string = null;

  public selectedAlbumId: number;
  public selectedAlbumPhotos: any[] = [];
  public selectedPhoto: any;

  public photoForSaving: any = { order: null, cropped: {}, original: '' };

  public savingNewPhoto: boolean;

  private facebookAlbumsServiceInstance;
  private appStateServiceInstance;

  constructor(
    private appStateService: AppStateService,
    private photosService: PhotosService,
    private facebookAlbumsService: FacebookAlbumsService
  ) { }

  ngOnInit(): any {
    // Start fetching my profile photos
    this._getProfilePhotos();

    // Start fetching my facebook albums and photos
    // Load first 12 facebook albums with first 20 photos present in each faceboom album
    this.facebookAlbumsService.startLoadingAlbums(6, 20);

    // Subscribe to App state service updates.
    this.appStateServiceInstance = this.appStateService.editPhotosStateEmitter
      .subscribe((state: any) => {

        if (!!state.page) {
          this.page = state.page;

          // If on Choose Photo page, assign selected album id.
          if (this.page === 3 && !!state.albumId) {
            this.selectedAlbumPhotos = [];
            this.nextPhotosUrl = null;
            this.selectedAlbumId = state.albumId;
            this.facebookAlbumsService.startLoadingPhotos();
          }

          // If on Crop Photo page, assign selected photo for cropping.
          if (this.page === 4 && !!state.photo) {
            this.selectedPhoto = state.photo;
          }

        }

        if (!!state.savePhotoAndRefresh) {
          this._saveNewPhoto();
        }
      });

    // Subscribe to facebook albums service updates.
    this.facebookAlbumsServiceInstance = this.facebookAlbumsService.serviceObserver()
      .subscribe((res) => {
        this.loadingFBAlbums = res.loading;
        this.albums = res.data;
        this.nextAlbumUrl = res.next;

        // If facebook album is selected, get Album photos and next url for loading more photos.
        if (!!this.selectedAlbumId) {
          this.loadingFBPhotos = res.loadingPhotos;
          let photos = this.facebookAlbumsService.getAlbumPhotos(this.selectedAlbumId);
          this.selectedAlbumPhotos = photos.data;
          this.nextPhotosUrl = photos.paging.next;
        }

      });
  }

  ngOnDestroy() {
    this.facebookAlbumsServiceInstance.unsubscribe();
    this.appStateServiceInstance.unsubscribe();
  }

  public deletePhoto(photo: Photo) {
    this.photosService.delete(photo.resourceUri, (status) => {
      if (status === 1) {
        this._getProfilePhotos();
      }
    });
  }

  public loadMoreFBAlbums(event) {
    if (this.nextAlbumUrl && !this.loadingFBAlbums) {
      this.facebookAlbumsService.loadMore();
    }
  }

  public loadMoreFBPhotos(event) {
    if (this.nextPhotosUrl && !this.loadingFBPhotos) {
      this.facebookAlbumsService.loadMorePhotos(this.selectedAlbumId);
    }
  }

  public assignPhotoForSaving(data: any) {
    this.photoForSaving = data;
  }

  private _getProfilePhotos() {
    if (this.loadingPhotos) {
      return;
    }
    this.loadingPhotos = true;
    this.photosService.getMyPhotos(EditPhotosMobileComponent.EDIT_PHOTOS_LIMIT)
      .subscribe((dtoJson: any) => {
        this.photos = PhotosService.getEditPhotos(dtoJson,
          EditPhotosMobileComponent.EDIT_PHOTOS_LIMIT);
        this.photosCount = PhotosService.getEditPhotosCount(dtoJson);
        this.loadingPhotos = false;
      });
  }

  private _saveNewPhoto() {
    if (this.savingNewPhoto) {
      return;
    }
    this.savingNewPhoto = true;

    this.photoForSaving.order = this._findOrderOfEmptyPhoto(this.photos);

    if (!!this.photoForSaving.order) {
      this.photosService.save(this.photoForSaving, (res) => {
        this.savingNewPhoto = false;
        this._getProfilePhotos();
      });
    }
  }

  private _findOrderOfEmptyPhoto(list: Photo[]): number {
    let order: number;
    for (var j = 0; j < list.length; ++j) {
      if (list[j].id === -1) {
        return list[j].order;
      }
    }
    return order;
  }

}
