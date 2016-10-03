import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'prs-acceptpass',
  templateUrl: './acceptpass.html'
})
export class AcceptPassComponent implements OnChanges {
  @Input() user;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;
  passIsActive: boolean = false;
  acceptIsActive: boolean = false;
  timeoutPass: any;
  timeoutAccept: any;

  ngOnChanges(values): any {
    this.passIsActive = false;
    this.acceptIsActive = false;
    this.timeoutPass = null;
    this.timeoutAccept = null;
  }

  passUser(event): void {
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
      this.passEvent.next({ user: this.user, next: true });
    }, 1500);

  }

  acceptUser(event): void {
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
      this.acceptEvent.next({ user: this.user, next: true });
    }, 1500);
  }
}
