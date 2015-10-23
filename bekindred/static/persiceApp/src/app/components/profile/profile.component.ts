/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input, Output, EventEmitter} from 'angular2/angular2';
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
  @Input() user;
  @Output() acceptEvent: EventEmitter = new EventEmitter;
  @Output() passEvent: EventEmitter = new EventEmitter;
  constructor() {

  }

  passUser(event) {
    this.passEvent.next(true);
  }

  acceptUser(event) {
    this.acceptEvent.next(true);
  }
}

