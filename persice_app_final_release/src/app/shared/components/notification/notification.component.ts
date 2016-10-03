import { Component, Input } from '@angular/core';

@Component({
  selector: 'prs-notification',
  templateUrl: './notification.html'
})
export class NotificationComponent {
  @Input() body: string;
  @Input() title: string;
  @Input() active: boolean = false;
  @Input() type: string;
  @Input() main: boolean;
  @Input() full: boolean;

  close(): void {
    this.active = false;
  }

}
