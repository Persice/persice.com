import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {Observable, Subscription} from 'rxjs';

import {MessagesMobileService} from './messages-mobile.service';
import {UnreadMessagesCounterService} from './../../../common/services';

import {AppStateService} from '../../shared/services';
import {WebsocketService} from '../../../app/shared/services';
import {ConversationMessagesMobileComponent} from './conversation-messages';
import {Message, Conversation} from '../../../common/models';
import {ConversationHeaderMobileComponent} from './conversation-header';
import {ConversationInputMobileComponent} from './conversation-input';

@Component({
  selector: 'prs-mobile-conversations',
  template: `
    <prs-mobile-conversation-header [title]="conversationTitle | async">
    </prs-mobile-conversation-header>
    <prs-mobile-conversation-messages [messages]="messages | async"
      [loading]="loading | async"
      [loaded]="loaded | async"
      [loadedCount]="loadedCount | async"
      [totalCount]="totalCount | async"
      [isNewMessageBeingSent]="isNewMessageBeingSent | async"
      (onScrollTop)="loadConversationMessages($event)">
    </prs-mobile-conversation-messages>
    <prs-mobile-conversation-input [isNewMessageBeingSent]="isNewMessageBeingSent | async"
      (onSendMessage)="sendMessage($event)">
    </prs-mobile-conversation-input>
  `,
  directives: [
    ConversationHeaderMobileComponent,
    ConversationInputMobileComponent,
    ConversationMessagesMobileComponent
  ],
  providers: [MessagesMobileService, UnreadMessagesCounterService]
})
export class ConversationMobileComponent implements OnInit, OnDestroy {

  private messages: Observable<Message[]>;
  private loading: Observable<boolean>;
  private loaded: Observable<boolean>;
  private loadedCount: Observable<number>;
  private totalCount: Observable<number>;
  private isNewMessageBeingSent: Observable<boolean>;
  private selectedConversation: Observable<Conversation>;
  private conversationTitle: Observable<string>;
  private senderId: string;

  private websocketServiceSubs: Subscription;

  constructor(
    private messagesService: MessagesMobileService,
    private params: RouteParams,
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
    this.senderId = this.params.get('senderId');
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

    setTimeout(() => jQuery('#intercom-launcher').css('display', 'none'), 500);
  }

  ngOnDestroy() {
    this.appStateService.setHeaderVisibility(true);
    this.websocketServiceSubs.unsubscribe();
    this.markConversationRead();
    setTimeout(() => jQuery('#intercom-launcher').css('display', 'block'), 500);

  }

  public loadConversationMessages() {
    this.messagesService.loadMessages(this.senderId);
  }

  public sendMessage(message: string) {
    this.messagesService.sendMessage(this.senderId, message);
  }

  /**
   *  Mark all messages in this conversation as read and refresh unread messages counter.
   */
  private markConversationRead(): void {
    let subs = this.messagesService.markConversationRead(this.senderId)
      .subscribe((data) => {
        this.unreadMessagesCounterService.refresh();
        subs.unsubscribe();
      });
  }

}
