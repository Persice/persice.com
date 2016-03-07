import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {InboxService} from '../../services/inbox.service';

@Component({
  selector: 'messages-sidebar-header',
  directives: [
    ROUTER_DIRECTIVES
  ],
  template: `
  <header class="chat-sidebar-header">
    <div class="layout layout--middle">
      <div class="layout__item 3/4">
        <h3 class="chat-sidebar-header__title">Conversation <span class="chat-sidebar-header__title__value">({{counter}})</span></h3>
      </div>
      <div class="layout__item 1/4 text-right">
        <a [routerLink]="['/Messages']" class="btn btn-1 btn-1--blue btn--icon-circle-small js-share mr-">
          <svg role="img" class="icon icon--tiny">
            <use xlink:href="/static/assets/icons/icons.svg#icon-new-message"></use>
          </svg>
        </a>
      </div>
    </div>
  </header>
  `
})
export class MessagesSidebarHeaderComponent {
  @Input() counter;
  inboxServiceObserver;
  constructor(private inboxService: InboxService) {
    this.inboxServiceObserver = this.inboxService.serviceCounterObserver()
      .subscribe(data => {
        this.counter = data;
      });
  }

  ngOnDestroy() {
    this.inboxServiceObserver.unsubscribe();
  }
}
