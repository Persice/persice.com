import {Component, Input} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  selector: 'prs-mobile-navigation',
  template: require('./navigation-mobile.html'),
  directives: [ROUTER_DIRECTIVES]
})
export class NavigationMobileComponent {
  @Input() username: string;
  @Input() unreadMessagesCounter: number;
  @Input() newConnectionsCounter: number;
}
