import { Component, EventEmitter, Input, Output, AfterContentInit } from '@angular/core';
import { GenderPipe } from '../../pipes';
import { ObjectUtil } from '../../../../common/core';
import { CheckImageDirective } from '../../directives';

@Component({
  selector: 'prs-user-card',
  pipes: [GenderPipe],
  template: <any>require('./user-card.html'),
  directives: [
    CheckImageDirective
  ]
})
export class UserCardComponent implements AfterContentInit {
  @Input() user;
  @Input() showButtons;
  @Output() onClick: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;
  interests = [];
  passIsActive = false;
  acceptIsActive = false;
  timeoutPass;
  timeoutAccept;

  passUser(event) {
    this.acceptIsActive = false;
    if (this.timeoutAccept) {
      window.clearTimeout(this.timeoutAccept);
    }

    if (this.passIsActive) {
      return;
    }
    this.passIsActive = true;
    if (this.timeoutPass) {
      window.clearTimeout(this.timeoutPass);
    }
    this.timeoutPass = setTimeout(() => {
      this.passEvent.next({user: this.user.id, next: false});
    }, 1500);

  }

  acceptUser(event) {
    this.passIsActive = false;
    if (this.timeoutPass) {
      window.clearTimeout(this.timeoutPass);
    }
    if (this.acceptIsActive) {
      return;
    }
    this.acceptIsActive = true;
    if (this.timeoutAccept) {
      window.clearTimeout(this.timeoutAccept);
    }
    this.timeoutAccept = setTimeout(() => {
      this.acceptEvent.next({user: this.user.id, next: false});
    }, 1500);
  }

  userClicked() {
    this.onClick.next(this.user.id);
  }

  ngAfterContentInit() {
    this.interests = ObjectUtil.firstSorted(this.user.top_interests[0], 3);

    if (!this.user.image || this.user.image === '') {
      this.user.image = '/static/assets/images/empty_avatar.png';
    }

  }

}
