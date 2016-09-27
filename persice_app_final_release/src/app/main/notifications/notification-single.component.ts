import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../common/services/notifications.service';

@Component({
  selector: 'prs-notification-single',
  templateUrl: './notification-single.component.html'
})
export class NotificationSingleComponent implements OnInit {
  @Input() notification;
  @Input() timeout;
  isVisible: boolean = false;

  constructor(
    private _service: NotificationsService,
    private _router: Router
  ) {

  }

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
    });

    if (this.timeout !== 0) {
      setTimeout(() => {
        this.removeSelf(true);
      }, this.timeout);
    }
  }

  removeSelf($event) {
    this.isVisible = false;
    setTimeout(() => {
      this._service.set(this.notification, false);
    }, 500);
  }

  performAction(event) {
    switch (this.notification.type) {
      case 'message':
        this._router.navigateByUrl('/messages/' + this.notification.data.sender_id);
        this.removeSelf(true);
        break;
      case 'connection':
        this._router.navigateByUrl('/' + this.notification.data.username);
        this.removeSelf(true);
        break;
      default:
        break;
    }

  }

}
