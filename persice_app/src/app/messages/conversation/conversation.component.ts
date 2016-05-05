import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';

import {
  InboxService,
  UserAuthService,
  MessagesService,
  MessagesCounterService,
  WebsocketService
} from '../../shared/services';


import {MessagesListComponent} from '../../shared/components/messages-list';
import {ConversationInputComponent} from '../conversation-input';
import {ConversationHeaderComponent} from './conversation-header.component';

import {LoadingComponent} from '../../shared/components/loading';

@Component({
  selector: 'prs-conversation',
  directives: [
    ConversationHeaderComponent,
    MessagesListComponent,
    ConversationInputComponent,
    LoadingComponent
  ],
  providers: [
    MessagesService,
    UserAuthService
  ],
  template: `
  <prs-conversation-header [name]="name"></prs-conversation-header>
  <div class="chat">
    <div class="chat-wrapper" id="messages">
      <div class="chat__messages-wrapper">
        <div class="chat__messages">
          <prs-loading [status]="loadingMessages"></prs-loading>
          <prs-message-list [messages]="messages"></prs-message-list>
        </div>
      </div>
    </div>
    <prs-send-message [disabled]="0" (newMessage)="sendMessage($event)"></prs-send-message>
  </div>
  `
})
export class ConversationComponent implements OnInit, OnDestroy {
  name: string = '';
  messages: Array<any> = [];
  totalCount;
  loadingMessages: boolean = false;
  loadingMessagesFinished: boolean = false;
  isMessagesEmpty: boolean = false;
  messagesNext: string = '';
  hasNew = false;
  messagesServiceInstance;
  websocketServiceInstance;
  threadId;
  scrollOffset = null;

  constructor(
    private _params: RouteParams,
    private inboxService: InboxService,
    private messagesService: MessagesService,
    private userService: UserAuthService,
    private messagesCounterService: MessagesCounterService,
    private websocketService: WebsocketService,
    private _router: Router
  ) {
    this.threadId = this._params.get('threadId');
  }


  ngOnInit() {
    let url = `/api/v1/auth/user/${this.threadId}/`;
    let channel = this.userService.findByUri(url)
      .subscribe((data) => {
        this.name = data.first_name;
        channel.unsubscribe();
      }, (err) => console.log('User could not be loaded'));

    this.inboxService.select(this.threadId);

    setTimeout(() => {
      this.messagesCounterService.refreshCounter();
    }, 500);

    //subscribe to messages service updates
    this.messagesServiceInstance = this.messagesService.serviceObserver()
      .subscribe((res) => {
        this.loadingMessages = res.loading;
        this.loadingMessagesFinished = res.finished;
        this.isMessagesEmpty = res.isEmpty;
        this.messagesNext = res.next;
        this.hasNew = res.hasNew;
        // this.name = res.name;
        let prevCount = this.messages.length;

        if (res.total === 0 && res.initialLoadingFinished) {
          this._router.parent.navigate(['/Messages', 'ConversationNewSelected', { friendId: this.threadId }]);
        }

        //when first loading messages, scroll to bottom
        // after initial messages have been rendered
        if (prevCount === 0 && !this.loadingMessages) {
          let elem = jQuery('#messages')[0];
          setTimeout(() => {
            elem.scrollTop = elem.scrollHeight;
          });
        }



        //if receieved new message scroll to bottom
        if (this.hasNew && !this.loadingMessages) {
          let elem = jQuery('#messages')[0];
          setTimeout(() => {
            elem.scrollTop = elem.scrollHeight;
          });
          this.hasNew = false;
        }

        this.messages = res.data;



        //when loading more messages finishes, scroll to bottom
        // after new messages have been rendered
        if (prevCount > 0 && !this.loadingMessages && this.scrollOffset !== null) {
          let elem = jQuery('#messages')[0];
          setTimeout(() => {
            elem.scrollTop = elem.scrollHeight - this.scrollOffset;
            this.scrollOffset = null;
          });
        }

        if (this.loadingMessagesFinished === false) {
          jQuery('#messages').bind('scroll', this.handleScrollEvent.bind(this));
        } else {
          jQuery('#messages').unbind('scroll');
        }

      });

    //start loading messages
    this.messagesService.startLoadingMessages(this.threadId);

    //subscribe to webscoket service updates
    this.websocketServiceInstance = this.websocketService.on('messages:new').subscribe((data: any) => {
      if (data.sender === `/api/v1/auth/user/${this.threadId}/`) {
        this.messagesService.recievedMessage(data);
      }
    });
  }

  handleScrollEvent(event) {
    //reverse scroll
    let elem = jQuery('#messages')[0];
    if (this.messagesNext && elem.scrollTop <= 50) {
      if (!this.loadingMessages && !this.hasNew) {
        this.scrollOffset = elem.scrollHeight;
        this.messagesService.loadMore(this.threadId);
      }
    }

  }

  sendMessage(message) {
    this.messagesService.send(this.threadId, message);
  }

  ngOnDestroy() {
    if (this.messagesServiceInstance) {
      this.messagesServiceInstance.unsubscribe();
    }

    if (this.websocketServiceInstance) {
      this.websocketServiceInstance.unsubscribe();
    }

  }
}
