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
  @Input() interestsCount;
  @Input() interestsMore;
  @Input() goals;
  @Input() goalsCount;
  @Input() goalsMore;
  @Input() offers;
  @Input() offersCount;
  @Input() offersMore;
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


}
