import {Component, Input} from 'angular2/core';

@Component({
	selector: 'notification-single',
	template: `
	<div class="notification-new is-visible">
	  <div class="flag flag--small">
	    <div class="flag__img">
	      <div class="icon-round-holder">
	        <svg role="img" class="icon icon--message" *ngIf="notification.type === 'message'">
	          <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-menu-messages"></use>
	        </svg>
	        <svg role="img" class="icon icon--connectoin" *ngIf="notification.type === 'connection'">
            <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-menu-connections"></use>
          </svg>
	      </div>
	    </div>
	    <div class="flag__body">
	      <span class="notification-new__label" [innerHTML]="notification.title"></span>
	      <span class="notification-new__value" *ngIf="notification.body !== ''">{{notification.body}}</span>
	    </div>
	  </div>
	  <a class="notification-new__close">
	    <svg role="img" class="icon ">
	      <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-close-small"></use>
	    </svg>
	  </a>
	</div>
	`
})
export class NotificationSingleComponent {
	@Input() notification;
}
