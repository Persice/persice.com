import {Component, Output, EventEmitter} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

/**
 * Components
 */
import {MessagesInputComponent} from './messages_input.component';
import {MessagesHeaderNewComponent} from '../messages_header_new/messages_header_new.component';
/**
 * Services
 */
import {InboxService} from '../../services/inbox.service';
import {MessagesService} from '../../services/messages.service';
import {UserAuthService} from '../../services/userauth.service';

@Component({
	selector: 'messages-new',
	template: require('./messages_new.html'),
	directives: [
		MessagesHeaderNewComponent,
		MessagesInputComponent
	],
	providers: [
		MessagesService
	]
})
export class MessagesNewComponent {
	tokens: any[] = [];
	initialTokens: any[] = [];
	message: string = '';
	friendId;

	constructor(
		private inboxService: InboxService,
		private messagesService: MessagesService,
		private userService: UserAuthService,
		private _router: Router,
		private _params: RouteParams
		) {
		this.friendId = this._params.get('friendId');
		//preselect a connection
		if (this.friendId !== null) {
			let uri = `/api/v1/auth/user/${this.friendId}/`;
			let channel = this.userService.findOneByUri(uri)
				.subscribe(data => {
					this.initialTokens = [{
						first_name: data.first_name,
						image: data.image,
						friend_id: this.friendId
					}];
					channel.unsubscribe();
				}, (err) => console.log('user could not be found'));
		}
	}

	sendMessage(message) {
		if (this.tokens.length === 1) {
			let channel = this.messagesService.sendNew(this.tokens[0].friend_id, message)
				.subscribe(data => {
					channel.unsubscribe();
					this.inboxService.refreshInbox();
					this._router.parent.navigate(['/Messages', 'SingleConversation', { threadId: this.tokens[0].friend_id }]);
				}, error => console.log('Could not create new message.'));
		}

	}

	routerOnActivate(nextInstruction, prevInstruction) {
		this.inboxService.deselectThreads();
	}
}
