import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MessagesService } from '../../../../common/services/messages.service';
import { UnreadMessagesCounterService } from '../../../../common/services';
import { Message } from '../../../../common/models/message';
import { Conversation } from '../../../../common/models/conversation';
import { AppStateService } from '../../../shared/services';
import { WebsocketService } from '../../../../common/services/websocket.service';

@Component({
  selector: 'prs-mobile-conversations',
  templateUrl: './conversation-mobile.component.html',
  providers: [ MessagesService, UnreadMessagesCounterService ]
})
export class ConversationMobileComponent implements OnInit, OnDestroy {

  public conversationTitle: Observable<string>;
  public messages: Observable<Message[]>;
  public loading: Observable<boolean>;
  public loaded: Observable<boolean>;
  public loadedCount: Observable<number>;
  public totalCount: Observable<number>;
  public isNewMessageBeingSent: Observable<boolean>;
  public selectedConversation: Observable<Conversation>;

  private senderId: string;

  private websocketServiceSubs: Subscription;
  private sub: any;

  constructor(
    private messagesService: MessagesService,
    private route: ActivatedRoute,
    private appStateService: AppStateService,
    private websocketService: WebsocketService,
    private unreadMessagesCounterService: UnreadMessagesCounterService
  ) {
    this.messages = this.messagesService.messages$;
    this.loading = this.messagesService.loading$;
    this.loaded = this.messagesService.loaded$;
    this.loadedCount = this.messagesService.loadedCount$;
    this.totalCount = this.messagesService.totalCount$;
    this.isNewMessageBeingSent = this.messagesService.isNewMessageBeingSent$;
    this.selectedConversation = this.messagesService.selectedConversation$;
    this.conversationTitle = this.messagesService.conversationTitle$;

    this.sub = this.route.params.subscribe(params => {
      this.senderId = params[ 'senderId' ];
    });

  }

  ngOnInit() {

    this.appStateService.setHeaderVisibility(false);
    this.messagesService.emptyConversationMessages();
    this.messagesService.loadConversationTitle(this.senderId);
    this.loadConversationMessages();

    this.markConversationRead();

    // Subscribe to websocket service updates for new message channel
    this.websocketServiceSubs = this.websocketService.on('messages:new').subscribe((data: any) => {
      this.messagesService.recievedMessageViaWebSocket(data, this.senderId);
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.appStateService.setHeaderVisibility(true);
    if (this.websocketServiceSubs) {
      this.websocketServiceSubs.unsubscribe();
    }
    this.markConversationRead();
  }

  public loadConversationMessages(event?: any) {
    this.messagesService.loadMessages(this.senderId);
  }

  public sendMessage(message: any) {
    this.messagesService.sendMessage(this.senderId, message);
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

}
