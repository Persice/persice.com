/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input, Output} from 'angular2/angular2';
import {ProfileAboutComponent} from '../profileabout/profileabout.component';
import {ProfileFeaturesComponent} from '../profilefeatures/profilefeatures.component';
import {ProfileLikesComponent} from '../profilelikes/profilelikes.component';
import {ProfileMutualsComponent} from '../profilemutuals/profilemutuals.component';

let view = require('./profile.html');

@Component({
  selector: 'profile',
  template: view,
  directives: [
    ProfileAboutComponent,
    ProfileFeaturesComponent,
    ProfileLikesComponent,
    ProfileMutualsComponent
  ]
})
export class ProfileComponent {
  // -@Input() user;
  constructor() {

  }
}

