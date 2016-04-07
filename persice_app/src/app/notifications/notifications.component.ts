import {Component, OnInit, OnDestroy} from 'angular2/core';

import {StringUtil} from '../shared/core';

import {NotificationSingleComponent} from './notification-single.component';
import {NotificationsService} from '../shared/services/notifications.service';

@Component({
  selector: 'prs-notifications',
  directives: [NotificationSingleComponent],
  template: `
  <div class="notifications-container">
    <prs-notification-single
    *ngFor="#notification of notifications"
    [notification]="notification"
    [timeout]="options.timeout">
    </prs-notification-single>
  </div>
  `
})
export class NotificationsComponent implements OnInit, OnDestroy {
  public notifications: any[] = [];

  public options: any = {
    limit: 3,
    lastOnBottom: false,
    timeout: 4000
  };

  private listener: any;

  constructor(
    private _service: NotificationsService
    ) {

  }

  ngOnInit() {
    // Listen for changes in the service
    this.listener = this._service.getChangeEmitter()
      .subscribe(item => {
        if (item === 'clean') this.notifications = [];
        else if (item.add) this.add(item.notification);
        else this.notifications.splice(this.notifications.indexOf(item.notification), 1);
      });
  }

  add(item) {
    item.createdOn = new Date();
    if (item.type === 'message') {
      item.body = StringUtil.words(item.body, 30);
    }
    item.id = Math.random().toString(36).substring(3);

    // Check if the notification should be added at the start or the end of the array
    if (this.options.lastOnBottom) {
      if (this.notifications.length >= this.options.limit) {
        this.notifications.splice(0, 1);
      };
      this.notifications.push(item);
    } else {
      if (this.notifications.length >= this.options.limit) {
        this.notifications.splice(this.notifications.length - 1, 1);
      }
      this.notifications.splice(0, 0, item);
    }
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
  }

}
