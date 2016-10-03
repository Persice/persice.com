import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { MessagesService } from '../../../../common/services/messages.service';
import { UnreadMessagesCounterService } from '../../../../common/services/unread-messages-counter.service';
import { Message } from '../../../../common/models/message/message.model';
import { WebsocketService } from '../../../../common/services/websocket.service';
import { ConversationsService } from '../../../../common/services/conversations.service';

@Component({
  selector: 'prs-conversation',
  providers: [
    MessagesService,
    UnreadMessagesCounterService
  ],
  templateUrl: './conversation.html'
})
export class ConversationComponent implements OnInit, OnDestroy {

  messages: Observable<Message[]>;
  loading: Observable<boolean>;
  loaded: Observable<boolean>;
  totalCount: Observable<number>;
  conversationTitle: Observable<string>;

  private websocketServiceSubs: Subscription;
  private messagesSubs: Subscription;
  private loadedSubs: Subscription;
  private routerSubs: Subscription;

  private senderId: string;
  private scrollOffset: number;

  constructor(
    private messagesService: MessagesService,
    private route: ActivatedRoute,
    private websocketService: WebsocketService,
    private unreadMessagesCounterService: UnreadMessagesCounterService,
    private conversationsService: ConversationsService
  ) {
    this.messages = this.messagesService.messages$;
    this.loading = this.messagesService.loading$;
    this.loaded = this.messagesService.loaded$;
    this.totalCount = this.messagesService.totalCount$;
    this.conversationTitle = this.messagesService.conversationTitle$;
  }

  ngOnInit(): any {
    this.routerSubs = this.route.params.subscribe(params => {
      this.messagesService.resetUser();
      this.senderId = params[ 'threadId' ];
      this.conversationsService.setSelectedConversationId(+this.senderId);

      this.init();
    });
  }

  ngOnDestroy(): any {
    if (this.loadedSubs) {
      this.loadedSubs.unsubscribe();
    }

    if (this.websocketServiceSubs) {
      this.websocketServiceSubs.unsubscribe();
    }

    if (this.messagesSubs) {
      this.messagesSubs.unsubscribe();
    }

    if (this.routerSubs) {
      this.routerSubs.unsubscribe();
    }
  }

  private init(): any {
    this.scrollOffset = 0;

    this.messagesService.loadConversationTitle(this.senderId);
    this.messagesService.emptyConversationMessages();
    this.loadMessages();
    this.markConversationRead();

    // Subscribe to messages, so that massages window scroll when messages load
    this.messagesSubs = this.messages.subscribe(() => {
      this.scroll();
    });

    this.loadedSubs = this.loaded.subscribe((loaded: boolean) => {
      if (loaded === false) {
        jQuery('#messages').bind('scroll', this.handleScrollEvent.bind(this));
      } else {
        jQuery('#messages').unbind('scroll');
      }
    });

    // Subscribe to websocket service updates for new message channel
    if (this.websocketServiceSubs) {
      this.websocketServiceSubs.unsubscribe();
    }
    this.websocketServiceSubs = this.websocketService.on('messages:new').subscribe((data: any) => {
      this.scrollOffset = 0;
      this.messagesService.recievedMessageViaWebSocket(data, this.senderId);
      this.markConversationRead();
    });
  }

  private handleScrollEvent(): void {
    // reverse scroll
    let elem = jQuery('#messages')[ 0 ];
    if (elem.scrollTop <= 10) {
      this.scrollOffset = elem.scrollHeight;
      this.loadMessages();
    }
  }

  private scroll(): void {
    let elem = jQuery('#messages')[ 0 ];
    setTimeout(() => {
      elem.scrollTop = elem.scrollHeight - this.scrollOffset;
    });
  }

  /**
   *  Mark all messages in this conversation as read and refresh unread messages counter.
   */
  private markConversationRead(): void {
    let subs = this.messagesService.markConversationRead(this.senderId)
      .subscribe(() => {
        this.unreadMessagesCounterService.refresh();
        if (subs) {
          subs.unsubscribe();
        }
      });
  }

  private loadMessages(): void {
    this.messagesService.loadMessages(this.senderId);
  }

  sendMessage(message: string): void {
    this.scrollOffset = 0;
    this.messagesService.sendMessage(this.senderId, message);
  }
}
