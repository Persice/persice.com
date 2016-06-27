import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

@Component({
  selector: 'prs-mobile-navigation',
  template: require('./navigation-mobile.html'),
  directives: [
    RouterLink
  ]
})
export class NavigationMobileComponent {
  @Input() username: string;
  @Input() unreadMessagesCounter: number;
  @Input() newConnectionsCounter: number;
}
