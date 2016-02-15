import {Component, Input} from 'angular2/core';
import {RouteParams} from 'angular2/router';

/**
 * Services
 */
import {InboxService} from '../../services/inbox.service';
import {MessagesService} from '../../services/messages.service';
import {MessagesCounterService} from '../../services/messages_counter.service';
import {WebsocketService} from '../../services/websocket.service';

/**
 * Components
 */
import {MessageListComponent} from '../message_list/message_list.component';
import {MessagesInputComponent} from './messages_input.component';
import {LoadingComponent} from '../loading/loading.component';
import {MessagesHeaderComponent} from '../messages_header/messages_header.component';

@Component({
  selector: 'messages-chat',
  directives: [
    MessagesHeaderComponent,
    MessageListComponent,
    MessagesInputComponent,
    LoadingComponent
  ],
  providers: [
    MessagesService
  ],
  template: `
  <messages-header [name]="name"></messages-header>
  <div class="chat">
	  <div class="chat-wrapper" id="messages">
	  	<div class="chat__messages-wrapper">
	    	<div class="chat__messages">
	    		<loading [status]="loadingMessages"></loading>
	        <message-list [messages]="messages"></message-list>
	    	</div>
	  	</div>
		</div>
		<div class="chat__send-message" (newMessage)="sendMessage($event)"></div>
	</div>
  `
})
export class MessagesChatComponent {
  name: string = 'Pero';
  messages: Array<any> = [];
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
    private messagesCounterService: MessagesCounterService,
    private websocketService: WebsocketService
    ) {
    this.threadId = this._params.get('threadId');
  }


  ngOnInit() {


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
      let prevCount = this.messages.length;


      //when first loading messages, scroll to bottom
      // after initial messages have been rendered
      if (prevCount === 0 && !this.loadingMessages) {
        let elem = jQuery('#messages')[0];
        setTimeout(() => {
          elem.scrollTop = elem.scrollHeight;
        });
      }



      //if recieved new message scroll to bottom
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
