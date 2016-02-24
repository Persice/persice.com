import {Component} from 'angular2/core';

/**
 * Services
 */

import {ConnectionsCounterService} from '../../services/connections_counter.service';

@Component({
	selector: 'connections-counter',
	template: `
	<i class="nav-main__value" [ngClass]="{'is-visible': counter > 0}">{{counter}}</i>
	`
})
export class ConnectionsCounterComponent {
	counter = 0;
	connectionsCounterServiceInstance;

	constructor(
		private connectionsCounterService: ConnectionsCounterService
		) {

	}

	ngOnInit() {
		this.connectionsCounterServiceInstance = this.connectionsCounterService.serviceObserver()
			.subscribe((data) => {
				this.counter = data.counter;
			});
	}

	ngOnDestroy() {
		if (this.connectionsCounterServiceInstance) {
			this.connectionsCounterServiceInstance.unsubscribe();
		}
	}


}
