import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {Observable, Subscription} from 'rxjs';

import {ConversationsMobileService} from './conversations-mobile.service';
import {WebsocketService} from './../../../app/shared/services';
import {ConversationsListMobileComponent} from './conversations-list';
import {Conversation} from '../../../common/models';
import {UnreadMessagesCounterService} from './../../../common/services';

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
  providers: [ConversationsMobileService, UnreadMessagesCounterService]
})
export class ConversationsMobileComponent implements OnInit, OnDestroy {
  private conversations: Observable<Conversation[]>;
  private loading: Observable<boolean>;
  private loaded: Observable<boolean>;

  private websocketServiceSubscription: Subscription;

  constructor(
    private conversationsService: ConversationsMobileService,
    private router: Router,
    private unreadMessagesCounterService: UnreadMessagesCounterService,
    private websocketService: WebsocketService
  ) {
    this.conversations = this.conversationsService.conversations$;
    this.loading = this.conversationsService.loading$;
    this.loaded = this.conversationsService.loaded$;
  }

  ngOnInit() {
    this.conversationsService.emptyConversations();
    this.conversationsService.loadConversations();

    // Subscribe to websocket service updates for new message channel
    this.websocketServiceSubscription = this.websocketService.on('messages:new').subscribe((data: any) => {
      this.conversationsService.receivedNewMessage(data);
    });
  }

  ngOnDestroy() {
    this.websocketServiceSubscription.unsubscribe();
  }

  public selectAndViewConversation(conversation: Conversation) {
    this.conversationsService.selectConversation(conversation);
    this.router.parent.navigate(['/Messages', 'Conversation', { senderId: conversation.senderId }]);
  }

  public loadMoreConversations($event: MouseEvent) {
    this.conversationsService.loadConversations();
  }

}
