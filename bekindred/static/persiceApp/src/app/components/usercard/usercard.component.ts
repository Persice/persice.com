/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgIf, NgFor, EventEmitter} from 'angular2/angular2';

import {ImageStretchDirective} from '../../directives/imagestretch.directive';
import {CircleProgressDirective} from '../../directives/circleprogress.directive';
import {GenderPipe} from '../../pipes/gender.pipe';

import {take} from 'lodash';

let view = require('./usercard.html');

@Component({
  inputs: ['user'],
  outputs: ['onClick'],
  selector: 'user-card',
  pipes: [GenderPipe],
  template: view,
  directives: [CircleProgressDirective, ImageStretchDirective, NgIf, NgFor]
})
export class UserCardComponent {
  user: any;
  onClick: EventEmitter = new EventEmitter;
  mediaUrl: string = '';

  userClicked() {
    this.onClick.next(this.user.id);
  }

  afterContentInit() {


    if (!this.user.image) {
      this.user.image = '/static/persiceApp/src/public/images/avatar_user_m.jpg';
    }
    else {
      //fix if no image present
      if (this.user.image && this.user.image === '' && this.user.gender === 'm') {
        this.user.image = '/static/persiceApp/src/public/images/avatar_user_m.jpg';
      }

      if (this.user.image && this.user.image === '' && this.user.gender === 'f') {
        this.user.image = '/static/persiceApp/src/public/images/avatar_user_f.jpg';
      }

      if (this.user.image && this.user.image === '' && this.user.gender === '') {
        this.user.image = '/static/persiceApp/src/public/images/avatar_user_m.jpg';
      }
    }

  }

  //take 3 shared interests
  keys(data, n): Array<string> {
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
    return take(keys, n);
  }

}




