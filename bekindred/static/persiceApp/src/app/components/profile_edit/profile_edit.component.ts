import {Component, Input, Output, ChangeDetectionStrategy, EventEmitter} from 'angular2/core';
import {mergeMap} from 'rxjs/operator/mergeMap';

//** Components */
import {ProfileEditPersonalInfoComponent}
from '../profile_edit_personalinfo/profile_edit_personalinfo.component';
import {ProfileEditPhotosComponent}
from '../profile_edit_photos/profile_edit_photos.component';
import {ProfileEditInterestsComponent}
from '../profile_edit_interests/profile_edit_interests.component';
import {ProfileEditGoalsComponent}
from '../profile_edit_goals/profile_edit_goals.component';
import {ProfileEditOffersComponent}
from '../profile_edit_offers/profile_edit_offers.component';


declare var jQuery: any;

let view = require('./profile_edit.html');

@Component({
  selector: 'profile-edit',
  template: view,
  directives: [
    ProfileEditPersonalInfoComponent,
    ProfileEditPhotosComponent,
    ProfileEditInterestsComponent,
    ProfileEditGoalsComponent,
    ProfileEditOffersComponent
  ]
})
export class ProfileEditComponent {
  @Input() user: { first_name: string, about_me: string, image: string };
  @Input() politicalViews;
  @Input() religiousViews;
  @Input() photos;
  @Input() activeSection;
  @Output() refreshUser: EventEmitter<any> = new EventEmitter;
  loadingEdit = false;
  activeTab = 'profile';
  profilePhotos = [];
  profileGoals = [];
  profileOffers = [];
  profileInterests = [];
  defaultPhoto;
  active = '';

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
            jQuery('#pr-edit-personal-info').scrollTop(0);
          }, 300);
          break;
        case 'religious':
          this.activeTab = 'profile';
          setTimeout(() => {
            jQuery('#pr-edit-personal-info').scrollTop(jQuery('#pr-edit-personal-info')[0].scrollHeight);
          }, 300);
          break;
        case 'political':
          this.activeTab = 'profile';
          setTimeout(() => {
            jQuery('#pr-edit-personal-info').scrollTop(jQuery('#pr-edit-personal-info')[0].scrollHeight);
          }, 300);
          break;
        case 'about':
          this.activeTab = 'profile';
          setTimeout(() => {
            jQuery('#pr-edit-personal-info').scrollTop(jQuery('#pr-edit-personal-info')[0].scrollHeight);
          }, 300);
          break;
        case 'photo':
          this.activeTab = 'photo';
          break;
        default:
          break;
      }
    }

  }

  closeModal(event) {
    this.refreshUser.next(true);
    let remodal = jQuery('[data-remodal-id=profile-edit]').remodal();
    remodal.close();
    this.activeTab = 'profile';
  }

}
