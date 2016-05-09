import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';

import {EditPersonalInfoComponent} from './edit-personalinfo.component';
import {EditPhotosComponent} from './edit-photos.component';
import {EditInterestsComponent} from './edit-interests.component';
import {EditGoalsComponent} from './edit-goals.component';
import {EditOffersComponent}from './edit-offers.component';
import {EditAlbumsComponent} from './edit-albums.component';
import {EditCropComponent} from './edit-crop.component';
import {LoadingComponent} from '../shared/components/loading';



@Component({
  selector: 'prs-edit-profile',
  template: require('./edit-profile.html'),
  directives: [
    EditPersonalInfoComponent,
    EditPhotosComponent,
    EditInterestsComponent,
    EditGoalsComponent,
    EditOffersComponent,
    EditAlbumsComponent,
    EditCropComponent,
    LoadingComponent
  ]
})
export class EditProfileComponent implements OnChanges {
  @Input() user: { first_name: string, about_me: string, image: string };
  @Input() politicalViews;
  @Input() religiousViews;
  @Input() photos;
  @Input() loadingPhotos;
  @Input() loadingPhotosAction;
  @Input() activeSection;
  @Output() refreshUser: EventEmitter<any> = new EventEmitter;
  @Output() deletePhoto: EventEmitter<any> = new EventEmitter;
  @Output() reorderPhoto: EventEmitter<any> = new EventEmitter;
  @Output() changeProfilePhoto: EventEmitter<any> = new EventEmitter;
  @Output() cropAndSavePhoto: EventEmitter<any> = new EventEmitter;
  loadingEdit = false;
  activeTab = 'profile';
  profilePhotos = [];
  profileGoals = [];
  profileOffers = [];
  profileInterests = [];
  defaultPhoto;
  active = '';
  cropImage;
  order: number = 0;

  photosAlbumsActive = false;
  photosAlbumsCrumbActive = false;
  photosCropActive = false;
  photosCropCrumbActive = false;

  constructor() {

  }

  openAlbums(event) {
    this.order = event;
    this.photosAlbumsActive = true;
    this.photosAlbumsCrumbActive = true;
    this.photosCropActive = false;
    this.photosCropCrumbActive = false;
  }

  closeAlbums(event) {
    this.photosAlbumsActive = false;
    this.photosCropActive = false;
    this.photosAlbumsCrumbActive = false;
    this.photosCropCrumbActive = false;
  }

  openCrop(event) {
    this.cropImage = event;
    this.photosAlbumsActive = false;
    this.photosAlbumsCrumbActive = true;
    this.photosCropCrumbActive = true;
    this.photosCropActive = true;
  }

  closeCrop(event) {
    this.photosCropActive = false;
    this.photosCropCrumbActive = false;
    this.photosAlbumsCrumbActive = true;
    this.photosAlbumsActive = true;
  }

  closePhotos(event) {
    this.photosAlbumsActive = false;
    this.photosCropActive = false;
    this.photosCropCrumbActive = false;
    this.photosAlbumsCrumbActive = false;
  }

  cropAndSave(event) {
    this.closePhotos(true);
    let photo = {
      cropped: event.cropped,
      original: event.original,
      order: this.order
    };
    this.cropAndSavePhoto.next(photo);

  }

  ngOnChanges(values) {
    if (values.user && values.user.currentValue) {
      this.defaultPhoto = values.user.currentValue.image;
    }

    if (values.interests && values.interests.currentValue) {
      this.profileInterests = values.interests.currentValue;
    }

    if (values.photos && values.photos.currentValue) {
      this.profilePhotos = values.photos.currentValue;
    }

    if (values.activeSection && values.activeSection.currentValue) {
      this.active = values.activeSection.currentValue;
      switch (values.activeSection.currentValue) {
        case 'Interests':
          this.activeTab = 'interests';
          break;
        case 'Goals':
          this.activeTab = 'goals';
          break;
        case 'Offers':
          this.activeTab = 'offers';
          break;
        case 'profile':
          this.activeTab = 'profile';
          setTimeout(() => {
            jQuery('.profile-edit__overflow').scrollTop(0);
          }, 300);
          break;
        case 'religious':
          this.activeTab = 'profile';
          setTimeout(() => {
            jQuery('.profile-edit__overflow').scrollTop(jQuery('.profile-edit__overflow')[0].scrollHeight);
          }, 300);
          break;
        case 'political':
          this.activeTab = 'profile';
          setTimeout(() => {
            jQuery('.profile-edit__overflow').scrollTop(jQuery('.profile-edit__overflow')[0].scrollHeight);
          }, 300);
          break;
        case 'about':
          this.activeTab = 'profile';
          setTimeout(() => {
            jQuery('.profile-edit__overflow').scrollTop(jQuery('.profile-edit__overflow')[0].scrollHeight);
          }, 300);
          break;
        case 'photos':
          this.activeTab = 'photos';
          break;
        default:
          break;
      }
    }

  }

  closeModal(event) {
    this.closePhotos(true);
    this.refreshUser.next(true);
    let remodal = jQuery('[data-remodal-id=profile-edit]').remodal();
    remodal.close();
  }

}
