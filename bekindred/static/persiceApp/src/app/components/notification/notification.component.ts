/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input, NgClass, NgIf} from 'angular2/angular2';

let view = require('./notification.html');
@Component({
  selector: 'notification',
  template: view,
  directives: [NgClass, NgIf]
})
export class NotificationComponent {
  @Input() body;
  @Input() title;
  @Input() active;
  @Input() type;

  close(event) {
    this.active = false;
  }

}
