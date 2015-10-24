/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input, NgFor, NgIf} from 'angular2/angular2';
import {take, sample, slice} from 'lodash';

let view = require('./profilefeatures.html');

@Component({
  template: view,
  selector: 'profile-features',
  directives: [NgFor, NgIf]
})
export class ProfileFeaturesComponent {
  @Input() interests;
  @Input() goals;
  @Input() offers;
  showAllInterests: boolean = false;
  showAllGoals: boolean = false;
  showAllOffers: boolean = false;

  toggleAll(section) {
    switch (section) {
      case 'interests':
        this.showAllInterests = true;
        break;
      case 'goals':
        this.showAllGoals = true;
        break;
      case 'offers':
        this.showAllOffers = true;
        break;
      default:
        break;
    }
  }

  count(data) {
    return Object.keys(data).length;
  }

  //tranfsorm and take first n items from {key: value}
  first(data, n): Array<string> {
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

  skip(data, n): Array<string> {
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
    let sliced = slice(keys, n);
    return sliced;
  }
}
