import {Component, Input, Output, ChangeDetectionStrategy, EventEmitter} from 'angular2/core';

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

//** Services */
import {MyProfileService} from '../../services/myprofile.service';

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
  ],
  providers: [
    MyProfileService
  ]
})
export class ProfileEditComponent {
  @Input() user: { first_name: string, about_me: string };
  @Input() interests;
  @Output() refreshUser: EventEmitter<any> = new EventEmitter;
  userEdit = {
    about_me: ''
  };
  unsubscribe;
  aboutError = false;
  activeTab = 'profile';
  profilePhotos = [];
  profileGoals = [];
  profileOffers = [];
  profileInterests = [];

  constructor(private service: MyProfileService) {

  }

  ngOnChanges(values) {
    if (values.user && values.user.currentValue) {
      this.userEdit.about_me = values.user.currentValue.about_me;
    }
    if (values.interests && values.interests.currentValue) {
      this.profileInterests = values.interests.currentValue;
    }
  }

  aboutChanged(data) {
    this.userEdit.about_me = data;
  }

  saveProfile(event) {
    this.aboutError = false;
    if (this.userEdit.about_me === '') {
      this.aboutError = true;
      return;
    }
    this.unsubscribe = this.service.update(this.userEdit)
      .subscribe((res) => {
      this.closeModal(true);
      this.refreshUser.next(true);
    },
      (err) => {
      },
      () => {

      });
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe.unsubscribe();
    }

  }

  closeModal(event) {
    let remodal = jQuery('[data-remodal-id=profile-edit]').remodal();
    remodal.close();
    this.activeTab = 'profile';
  }

}
