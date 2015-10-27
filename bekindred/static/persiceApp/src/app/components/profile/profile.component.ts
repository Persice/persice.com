/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input, Output, EventEmitter} from 'angular2/angular2';
import {ProfileAboutComponent} from '../profileabout/profileabout.component';
import {ProfileFeaturesComponent} from '../profilefeatures/profilefeatures.component';
import {ProfileLikesComponent} from '../profilelikes/profilelikes.component';
import {ProfileMutualsComponent} from '../profilemutuals/profilemutuals.component';
import {take, sample, slice} from 'lodash';

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
  profileLikes: Array<any> = [];
  profileLikesCount: number = 0;

  constructor() {
  }

  onInit() {
    this.profileLikes = this.transform(this.user.likes[0]);
    this.profileLikesCount = this.count(this.user.likes[0]);
  }

  passUser(event) {
    this.passEvent.next(true);
  }

  acceptUser(event) {
    this.acceptEvent.next(true);
  }

  count(data) {
    return Object.keys(data).length;
  }

  //tranfsorm and items from '{key: value, key: value}' to [{value: VALUE, match: 1|0}]
  transform(data): Array<string> {
    let keys = [];
    for (var key in data) {
      if (data[key] === 1) {
        keys.push({
          value: key,
          match: true
        });
      } else {
        keys.push({
          value: key,
          match: false
        });
      }
    }
    return keys;
  }
}

