import { Component, Input } from '@angular/core';

@Component({
  selector: 'prs-notification',
  template: <any>require('./notification.html')
})
export class NotificationComponent {
  @Input() body;
  @Input() title;
  @Input() active;
  @Input() type;
  @Input() main;
  @Input() full;

  close(event) {
    this.active = false;
  }

}
