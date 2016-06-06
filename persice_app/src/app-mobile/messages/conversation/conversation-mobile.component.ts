import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {Observable} from 'rxjs';

import {MessagesMobileService} from './messages-mobile.service';
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
      [isNewMessageBeingReceived]="isNewMessageBeingReceived | async"
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
  providers: [MessagesMobileService]
})
export class ConversationMobileComponent implements OnInit, OnDestroy {

  private messages: Observable<Message[]>;
  private loading: Observable<boolean>;
  private loaded: Observable<boolean>;
  private loadedCount: Observable<number>;
  private totalCount: Observable<number>;
  private isNewMessageBeingSent: Observable<boolean>;
  private isNewMessageBeingReceived: Observable<boolean>;
  private selectedConversation: Observable<Conversation>;
  private conversationTitle: Observable<string>;
  private senderId: string;

  private websocketServiceInstance;

  constructor(
    private messagesService: MessagesMobileService,
    private params: RouteParams,
    private appStateService: AppStateService,
    private websocketService: WebsocketService
  ) {
    this.messages = this.messagesService.messages$;
    this.loading = this.messagesService.loading$;
    this.loaded = this.messagesService.loaded$;
    this.loadedCount = this.messagesService.loadedCount$;
    this.totalCount = this.messagesService.totalCount$;
    this.isNewMessageBeingSent = this.messagesService.isNewMessageBeingSent$;
    this.isNewMessageBeingReceived = this.messagesService.isNewMessageBeingReceived$;
    this.selectedConversation = this.messagesService.selectedConversation$;
    this.conversationTitle = this.messagesService.conversationTitle$;
    this.senderId = this.params.get('senderId');
  }

  ngOnInit() {
    this.appStateService.setHeaderVisibility(false);
    this.messagesService.emptyConversationMessages();
    this.messagesService.loadConversationTitle(this.senderId);
    this.loadConversationMessages();

    // Subscribe to websocket service updates
    this.websocketServiceInstance = this.websocketService.on('messages:new').subscribe((data: any) => {
      this.messagesService.markConversationRead(this.senderId);
      this.messagesService.recievedMessageViaWebSocket(data, this.senderId);
    });

    setTimeout(() => jQuery('#intercom-launcher').css('display', 'none'), 500);
  }

  ngOnDestroy() {
    this.appStateService.setHeaderVisibility(true);
    this.websocketServiceInstance.unsubscribe();

    setTimeout(() => jQuery('#intercom-launcher').css('display', 'block'), 500);
  }

  public loadConversationMessages() {
    this.messagesService.loadMessages(this.senderId);
  }

  public sendMessage(message: string) {
    this.messagesService.sendMessage(this.senderId, message);
  }

}
