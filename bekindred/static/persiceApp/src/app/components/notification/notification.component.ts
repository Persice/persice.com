/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input, NgClass} from 'angular2/angular2';

let view = require('./notification.html');
@Component({
  selector: 'notification',
  template: view,
  directives: [NgClass]
})
export class NotificationComponent {
  @Input() body;
  @Input() title;
  @Input() active;
  constructor() {

  }

  close(event) {
    this.active = false;
  }

}
