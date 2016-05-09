import {Component} from '@angular/core';
import {Router, RouteParams} from '@angular/router-deprecated';


import {ConversationInputComponent} from '../conversation-input';
import {NewConversationHeaderComponent} from './new-conversation-header.component';

import {
  InboxService,
  MessagesService,
  UserAuthService
} from '../../shared/services';


@Component({
  selector: 'prs-new-conversation',
  template: require('./new-conversation.html'),
  directives: [
    NewConversationHeaderComponent,
    ConversationInputComponent
  ],
  providers: [
    MessagesService
  ]
})
export class NewConversationComponent {
  tokens: any[] = [];
  initialTokens: any[] = [];
  message: string = '';
  friendId;

  constructor(
    private inboxService: InboxService,
    private messagesService: MessagesService,
    private userService: UserAuthService,
    private _router: Router,
    private _params: RouteParams
  ) {
    this.friendId = this._params.get('friendId');
    //preselect a connection
    if (this.friendId !== null) {
      let uri = `/api/v1/auth/user/${this.friendId}/`;
      let channel = this.userService.findOneByUri(uri)
        .subscribe(data => {
          this.initialTokens = [{
            first_name: data.first_name,
            image: data.image,
            friend_id: this.friendId
          }];
          channel.unsubscribe();
        }, (err) => console.log('user could not be found'));
    }
  }

  sendMessage(message) {
    if (this.tokens.length === 1) {
      let channel = this.messagesService.sendNew(this.tokens[0].friend_id, message)
        .subscribe(data => {
          channel.unsubscribe();
          this.inboxService.addSender(this.tokens[0].friend_id);
          this._router.parent.navigate(['/Messages', 'SingleConversation', { threadId: this.tokens[0].friend_id }]);
        }, error => console.log('Could not create new message.'));
    }

  }

  routerOnActivate(nextInstruction, prevInstruction) {
    this.inboxService.deselectThreads();
  }
}
