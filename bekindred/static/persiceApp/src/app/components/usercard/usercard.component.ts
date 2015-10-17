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
  constructor() {

  }

    //take 3 shared interests
    keys(data): Array<string> {
      let keys = [];
      for (var key in data[0]) {
        if (data[0][key] === 1) {
          keys.push(key);
        }
      }

      return take(keys, 3);

    }
  }
