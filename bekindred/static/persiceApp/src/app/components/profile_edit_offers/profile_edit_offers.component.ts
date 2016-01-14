import {Component, Input, Output, ChangeDetectionStrategy} from 'angular2/core';

let view = require('./profile_edit_offers.html');

@Component({
  selector: 'profile-edit-offers',
  template: view
})
export class ProfileEditOffersComponent {
  @Input() offers;
}
