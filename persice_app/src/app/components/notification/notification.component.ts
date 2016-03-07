import {Component, Input} from 'angular2/core';

let view = require('./notification.html');
@Component({
  selector: 'notification',
  template: view
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
