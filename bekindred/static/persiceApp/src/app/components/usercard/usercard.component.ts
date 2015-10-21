/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgIf, NgFor} from 'angular2/angular2';

import {ImageStretchDirective} from '../../directives/imagestretch.directive';
import {CircleProgressDirective} from '../../directives/circleprogress.directive';
import {GenderPipe} from '../../pipes/gender.pipe';

import {take, sample} from 'lodash';

let view = require('./usercard.html');

@Component({
  inputs: ['user'],
  selector: 'user-card',
  pipes: [GenderPipe],
  template: view,
  directives: [CircleProgressDirective, ImageStretchDirective, NgIf, NgFor]
})
export class UserCardComponent {
  user: any;
  mediaUrl: string = '';

  constructor() {

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


    // //temp fix for shared_interest
    // let interest = [{
    //   acting: 1,
    //   animals: 0,
    //   antiques: 1,
    //   archery: 1,
    //   art: 0,
    //   backpacking: 1,
    //   badminton: 1,
    //   ballet: 1,
    //   baseball: 0
    // }];
    // this.user.shared_interest = this.keys(interest);
  }

  //take 3 shared interests
  keys(data): Array<string> {
    let keys = [];
    for (var key in data[0]) {
      if (data[0][key] === 1) {
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
    return take(keys, 3);
  }

}




