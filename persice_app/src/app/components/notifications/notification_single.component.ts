import {Component, Input} from 'angular2/core';
import {Router} from 'angular2/router';
import {NotificationsService} from '../../services/notifications.service';

@Component({
  selector: 'notification-single',
  template: `
  <div class="notification-new" [ngClass]="{'is-visible': isVisible}">
    <div class="flag flag--small" (click)="performAction($event)">
      <div class="flag__img">
        <div class="icon-round-holder">
          <svg role="img" class="icon icon--message" *ngIf="notification.type === 'message'">
            <use xlink:href="/static/assets/icons/icons.svg#icon-menu-messages"></use>
          </svg>
          <svg role="img" class="icon icon--connectoin" *ngIf="notification.type === 'connection'">
            <use xlink:href="/static/assets/icons/icons.svg#icon-menu-connections"></use>
          </svg>
        </div>
      </div>
      <div class="flag__body">
        <span class="notification-new__label" [innerHTML]="notification.title"></span>
        <span class="notification-new__value" *ngIf="notification.body !== ''">{{notification.body}}</span>
      </div>
    </div>
    <a class="notification-new__close" (click)="removeSelf($event)">
      <svg role="img" class="icon ">
        <use xlink:href="/static/assets/icons/icons.svg#icon-close-small"></use>
      </svg>
    </a>
  </div>
  `
})
export class NotificationSingleComponent {
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
        this._router.navigate(['Messages', 'SingleConversation', { 'threadId': this.notification.data.sender_id }]);
        this.removeSelf(true);
        break;
      case 'connection':
        this._router.navigate(['ProfileView', { 'username': this.notification.data.username }]);
        this.removeSelf(true);
        break;
      default:
        break;
    }

  }

}
