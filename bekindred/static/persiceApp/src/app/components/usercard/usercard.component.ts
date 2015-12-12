import {Component, NgIf, NgFor, EventEmitter, NgStyle} from 'angular2/angular2';

import {CircleProgressDirective} from '../../directives/circleprogress.directive';
import {GenderPipe} from '../../pipes/gender.pipe';
import {ObjectUtil} from '../../core/util';

let view = require('./usercard.html');

@Component({
  inputs: ['user'],
  outputs: ['onClick'],
  selector: 'user-card',
  pipes: [GenderPipe],
  template: view,
  directives: [CircleProgressDirective, NgIf, NgFor, NgStyle]
})
export class UserCardComponent {
  user: any;
  onClick: EventEmitter<any> = new EventEmitter;
  interests = [];


  userClicked() {
    this.onClick.next(this.user.id);
  }


  ngAfterContentInit() {
    this.interests = ObjectUtil.firstSorted(this.user.top_interests[0], 3);

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

}




