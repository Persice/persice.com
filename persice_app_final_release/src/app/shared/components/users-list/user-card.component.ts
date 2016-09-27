import { Component, EventEmitter, Input, Output, AfterContentInit } from '@angular/core';
import { ObjectUtil } from '../../../../common/core';

@Component({
  selector: 'prs-user-card',
  templateUrl: './user-card.html',
})
export class UserCardComponent implements AfterContentInit {
  @Input() set user(value) {
    this.person = value;
  };

  @Input() showButtons;
  @Output() onClick: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;
  person: any;
  interests = [];
  passIsActive = false;
  acceptIsActive = false;
  timeoutPass;
  timeoutAccept;

  passUser(event: MouseEvent) {
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
      this.passEvent.emit({ user: this.person.id, next: false });
    }, 1500);

  }

  acceptUser(event: MouseEvent) {
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
      this.acceptEvent.emit({ user: this.person.id, next: false });
    }, 1500);
  }

  userClicked(event: MouseEvent) {
    this.onClick.emit(this.person.id);
  }

  ngAfterContentInit() {
    this.interests = ObjectUtil.firstSorted(this.person.top_interests[ 0 ], 3);

    if (!this.person.image || this.person.image === '') {
      this.person.image = '/assets/images/empty_avatar.png';
    }

  }

}
