import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

/**
 * Components
 */

import {MessagesCounterComponent} from '../messages_counter/messages_counter.component';
import {ConnectionsCounterComponent} from '../connections_counter/connections_counter.component';

let view = require('./navmain.html');
@Component({
  selector: 'nav-main',
  template: view,
  directives: [
		ROUTER_DIRECTIVES,
		MessagesCounterComponent,
		ConnectionsCounterComponent
  ]
})
export class NavMainComponent {

}
