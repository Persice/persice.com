import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {Observable} from 'rxjs';

import {ConversationsMobileService} from './conversations-mobile.service';
import {ConversationsListMobileComponent} from './conversations-list';
import {Conversation} from '../../../common/models';

@Component({
  selector: 'prs-mobile-conversations',
  template: `
    <prs-mobile-conversations-list
      [conversations]="conversations | async"
      [loading]="loading | async"
      [loaded]="loading | async"
      (onConversationClick)="selectAndViewConversation($event)"
      (onScrollBottom)="loadMoreConversations($event)">
    </prs-mobile-conversations-list>
  `,
  directives: [ConversationsListMobileComponent],
  providers: [ConversationsMobileService]
})
export class ConversationsMobileComponent implements OnInit {
  private conversations: Observable<Conversation[]>;
  private loading: Observable<boolean>;
  private loaded: Observable<boolean>;

  constructor(
    private conversationsService: ConversationsMobileService,
    private router: Router
    ) {
    this.conversations = this.conversationsService.conversations$;
    this.loading = this.conversationsService.loading$;
    this.loaded = this.conversationsService.loaded$;
  }

  ngOnInit() {
    this.conversationsService.emptyConversations();
    this.conversationsService.loadConversations();
  }

  public selectAndViewConversation(conversation: Conversation) {
    this.conversationsService.markConversationRead(conversation.senderId);
    this.conversationsService.selectConversation(conversation);
    this.router.parent.navigate(['/Messages', 'Conversation', {senderId: conversation.senderId}]);
  }

  public loadMoreConversations($event: MouseEvent) {
    this.conversationsService.loadConversations();
  }

}
