import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HeaderState } from '../../header';
import { UnreadMessagesCounterService } from '../../../../common/services';
import { ConversationsService } from '../../../../common/services/conversations.service';
import { Conversation } from '../../../../common/models/conversation';
import { WebsocketService } from '../../../../common/services/websocket.service';
import { AppStateService } from '../../../shared/services';

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
  providers: [ ConversationsService, UnreadMessagesCounterService ]
})
export class ConversationsMobileComponent implements OnInit, OnDestroy {
  public conversations: Observable<Conversation[]>;
  public loading: Observable<boolean>;
  public loaded: Observable<boolean>;

  private websocketServiceSubscription: Subscription;

  constructor(
    private conversationsService: ConversationsService,
    private router: Router,
    private unreadMessagesCounterService: UnreadMessagesCounterService,
    private websocketService: WebsocketService,
    private appStateService: AppStateService
  ) {
    this.conversations = this.conversationsService.conversations$;
    this.loading = this.conversationsService.loading$;
    this.loaded = this.conversationsService.loaded$;
  }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit(HeaderState.messages);
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
    this.router.navigateByUrl('messages/' + conversation.senderId);
  }

  public loadMoreConversations($event: MouseEvent) {
    this.conversationsService.loadConversations();
  }

}