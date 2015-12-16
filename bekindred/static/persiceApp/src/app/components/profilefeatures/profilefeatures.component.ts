import {Component, Input} from 'angular2/core';

let view = require('./profilefeatures.html');

@Component({
  template: view,
  selector: 'profile-features'
})
export class ProfileFeaturesComponent {
  @Input() interests;
  @Input() keywords;
  @Input() keywordsCount;
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
