import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { MessagesCounterComponent } from './messages-counter.component';
import { ConnectionsCounterComponent } from './connections-counter.component';

@Component({
  selector: 'prs-navigation',
  directives: [
    ROUTER_DIRECTIVES,
    MessagesCounterComponent,
    ConnectionsCounterComponent
  ],
  template: `
  <nav class="nav-main">
    <ul>
      <li>
        <a [routerLink]="['./Crowd']">
          <svg role="img" class="icon">
            <use xlink:href="/static/assets/icons/icons.svg#icon-menu-crowd"></use>
          </svg>
          <span>Crowd</span>
        </a>
      </li>
      <li>
        <a [routerLink]="['./Messages']">
          <svg role="img" class="icon">
            <use xlink:href="/static/assets/icons/icons.svg#icon-menu-messages"></use>
          </svg>
          <span>Messages</span>
          <prs-messages-counter></prs-messages-counter>
        </a>
      </li>
      <li>
        <a [routerLink]="['./Connections']">
          <svg role="img" class="icon">
            <use xlink:href="/static/assets/icons/icons.svg#icon-menu-connections"></use>
          </svg>
          <span>Pals</span>
          <prs-connections-counter></prs-connections-counter>
        </a>
      </li>
      <li>
        <a [routerLink]="['./Events', 'AllEventsList']">
          <svg role="img" class="icon">
            <use xlink:href="/static/assets/icons/icons.svg#icon-menu-events"></use>
          </svg>
          <span>Events</span>
        </a>
      </li>
    </ul>
  </nav>
  `
})
export class NavigationComponent {

}
