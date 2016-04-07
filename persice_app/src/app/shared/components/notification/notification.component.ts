import {Component, Input} from 'angular2/core';

@Component({
  selector: 'prs-notification',
  template: require('./notification.html')
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
