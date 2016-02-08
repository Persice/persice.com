import {Component} from 'angular2/core';

/**
 * Services
 */

import {MessagesCounterService} from '../../services/messages_counter.service';

@Component({
	selector: 'messages-counter',
	template: `
	<i class="nav-main__value" [ngClass]="{'is-visible': counter > 0}">{{counter}}</i>
	`
})
export class MessagesCounterComponent {
	counter = 0;
	messagesCounterServiceInstance;

	constructor(
		private messagesCounterService: MessagesCounterService
		) {

	}

	ngOnInit() {
		this.messagesCounterServiceInstance = this.messagesCounterService.serviceObserver()
			.subscribe((data) => {
				this.counter = data.counter;
			});
	}

	ngOnDestroy() {
		if (this.messagesCounterServiceInstance) {
			this.messagesCounterServiceInstance.unsubscribe();
		}
	}


}
