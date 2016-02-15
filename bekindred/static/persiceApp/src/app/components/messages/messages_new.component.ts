import {Component, Output, EventEmitter} from 'angular2/core';

import {MessagesHeaderNewComponent} from '../messages_header_new/messages_header_new.component';
/**
 * Services
 */
import {InboxService} from '../../services/inbox.service';

@Component({
	selector: 'messages-new',
	template: `
	<messages-header-new></messages-header-new>
  <div class="chat">
	  <div class="chat-wrapper">
	  	<div class="chat__messages-wrapper">
	    	<div class="chat__messages">
	    		<div class="chat__messages__blank-slate">
				    <svg role="img" class="icon chat-empty-state__icon">
				        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#start_conversation"></use>
				    </svg>
				    <h3 class="chat-empty-state__title">Start conversation</h3>
				    <p class="chat-empty-state__par">Type your message below to start Conversation</p>
					</div>
	    	</div>
	  	</div>
		</div>
		<div class="chat__send-message">
		  <div class="tableize">
		    <div class="tableize__cell tableize__cell--fill">
		      <div class="tableize__content">
		        <textarea class="c-input c-input--large" placeholder="Write a message"></textarea>
		      </div>
		    </div>
		    <div class="tableize__cell">
		      <div class="tableize__content chat__send-message__has-btn"> <a href="#" class="btn btn-1 btn-1--full btn-1--filled btn-1--blue ">Send</a> </div>
		    </div>
		  </div>
		</div>
	</div>
	`,
	directives: [
		MessagesHeaderNewComponent
	]
})
export class MessagesNewComponent {
	constructor(private inboxService: InboxService) {

	}

	routerOnActivate(nextInstruction, prevInstruction) {
		this.inboxService.deselectThreads();

	}
}
