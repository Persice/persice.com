import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'prs-mobile-profile-footer',
  template: require('./profile-footer.html')
})
export class ProfileFooterMobileComponent {
  @Input() score: number;
  @Input() type: string;
  @Input() userId: number;
  @Output() onAcceptPassEvent: EventEmitter<any> = new EventEmitter();

  passIsActive = false;
  acceptIsActive = false;
  timeoutPass;
  timeoutAccept;

  pass(event) {
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
      this.onAcceptPassEvent.emit({ userId: this.userId, status: -1 });
    }, 1500);

  }

  accept(event) {
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
      this.onAcceptPassEvent.emit({ userId: this.userId, status: 0 });
    }, 1500);
  }
}
