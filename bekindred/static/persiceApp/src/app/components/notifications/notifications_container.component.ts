import {Component} from 'angular2/core';

import {NotificationSingleComponent} from './notification_single.component';

@Component({
	selector: 'notifications-container',
	directives: [NotificationSingleComponent],
	template: `
	<div class="notifications-container">
		<notification-single
			*ngFor="#notification of notifications"
			[notification]="notification">
		</notification-single>
  </div>
	`
})
export class NotificationsContainerComponent {
	notifications = [
		{
			title: 'You and <strong>Pero</strong> are now connections',
			body: '',
			type: 'connection'
		},
		{
			title: '1 new message from Mike',
			body: 'asdas asd sad sadsadsad asd sad sadas...',
			type: 'message'
		},
			{
			title: '1 new message from Mike',
			body: 'asdas asd sad sadsadsad asd sad sadas...',
			type: 'message'
		}
	];
}
