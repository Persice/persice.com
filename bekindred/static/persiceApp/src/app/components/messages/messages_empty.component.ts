import {Component, Output, EventEmitter} from 'angular2/core';

/**
 * Services
 */
import {InboxService} from '../../services/inbox.service';

@Component({
	selector: '.chat__empty',
	template: `
	<div class="chat__empty no-results is-visible">
  	<h2 class="no-results__title">No conversations selected.</h2>
  	<p class="no-results__par"></p>
	</div>
	`
})
export class MessagesEmptyComponent {
	constructor(private inboxService: InboxService) {

	}

	routerOnActivate(nextInstruction, prevInstruction) {
		this.inboxService.deselectThreads();

	}
}
