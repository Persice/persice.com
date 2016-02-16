import {Component, Output, EventEmitter} from 'angular2/core';
import {Router} from 'angular2/router';

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
	message: string = '';

	constructor(
		private inboxService: InboxService,
		private messagesService: MessagesService,
		private _router: Router
		) {

	}

	sendMessage(message) {
		if (this.tokens.length === 1) {
			let channel = this.messagesService.sendNew(this.tokens[0].friend_id, message)
				.subscribe(data => {
					channel.unsubscribe();
					this._router.parent.navigate(['/Messages', 'SingleConversation', { threadId: this.tokens[0].friend_id }]);
				}, error => console.log('Could not create new message.'));
		}

	}

	routerOnActivate(nextInstruction, prevInstruction) {
		this.inboxService.deselectThreads();
	}
}
