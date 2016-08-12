import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { MessagesCounterComponent } from './messages-counter.component';
import { ConnectionsCounterComponent } from './connections-counter.component';

@Component({
  selector: 'prs-navigation',
  directives: [
    ROUTER_DIRECTIVES,
    MessagesCounterComponent,
    ConnectionsCounterComponent
  ],
  template: <any>require('./navigation.html')
})
export class NavigationComponent {

}
