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
  @Input() main;
  @Input() full;

  close(event) {
    this.active = false;
  }

}
