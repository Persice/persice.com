import {Component, EventEmitter, Input, Output} from 'angular2/core';

import {CircleProgressDirective} from '../../directives/circleprogress.directive';
import {GenderPipe} from '../../pipes/gender.pipe';
import {ObjectUtil} from '../../core/util';

let view = require('./usercard.html');

@Component({
  inputs: ['user'],
  selector: 'user-card',
  pipes: [GenderPipe],
  template: view,
  directives: [CircleProgressDirective]
})
export class UserCardComponent {
  user: any;
  interests = [];

  @Input() showButtons;
  @Output() onClick: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;

  passUser(event) {
    this.passEvent.next(this.user.id);
  }

  acceptUser(event) {
    this.acceptEvent.next(this.user.id);
  }


  userClicked() {
    this.onClick.next(this.user.id);
  }




  ngAfterContentInit() {
    this.interests = ObjectUtil.firstSorted(this.user.top_interests[0], 3);

    if (!this.user.image) {
      this.user.image = '/static/persiceApp/src/assets/images/avatar_user_m.jpg';
    }
    else {
      //fix if no image present
      if (this.user.image && this.user.image === '' && this.user.gender === 'm') {
        this.user.image = '/static/persiceApp/src/assets/images/avatar_user_m.jpg';
      }

      if (this.user.image && this.user.image === '' && this.user.gender === 'f') {
        this.user.image = '/static/persiceApp/src/assets/images/avatar_user_f.jpg';
      }

      if (this.user.image && this.user.image === '' && this.user.gender === '') {
        this.user.image = '/static/persiceApp/src/assets/images/avatar_user_m.jpg';
      }
    }

  }

}




