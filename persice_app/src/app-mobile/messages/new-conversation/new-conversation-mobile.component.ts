import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
import {Router, RouteParams} from '@angular/router-deprecated';
import {Subscription} from 'rxjs';

import {AppStateService} from "../../shared/services/app-state.service";
import {MessagesService} from "../../../app/shared/services/messages.service";
import {InboxService} from "../../../app/shared/services/inbox.service";
import {UserAuthService} from "../../../app/shared/services/userauth.service";

@Component({
  template: require('./new-conversation-mobile.html'),
  providers: [
    InboxService,
    MessagesService,
    UserAuthService]
})
export class NewConversationMobileComponent implements OnInit, OnDestroy {

  tokens: any[] = [];
  recipientId: string;
  messageText: string = '';

  constructor(
    private appStateService: AppStateService,
    private _location: Location,
    private inboxService: InboxService,
    private messagesService: MessagesService,
    private userService: UserAuthService,
    private _router: Router,
    private _params: RouteParams
  ) {
    this.recipientId = this._params.get('recipientId');

    // Preselect a recipient.
    if (this.recipientId !== null) {
      let uri = `/api/v1/auth/user/${this.recipientId}/`;
      let channel = this.userService.findOneByUri(uri)
        .subscribe(data => {
          this.tokens.push({
            first_name: data.first_name,
            image: data.image,
            friend_id: this.recipientId
          });
          channel.unsubscribe();
        });
    }
  }

  ngOnInit(): any {
    this.appStateService.setHeaderVisibility(false);
  }

  ngOnDestroy() {
    this.appStateService.setHeaderVisibility(true);
  }

  back() {
    this._location.back();
  }

  send() {
    if (this.tokens.length === 1 && this.messageText.length > 0) {
      let subs: Subscription = this.messagesService.sendNew(this.tokens[0].friend_id, this.messageText)
        .subscribe(() => {
          subs.unsubscribe();
          this.inboxService.addSender(this.tokens[0].friend_id);
          this._router.parent.navigate(['/Messages', 'Conversation', {senderId: this.tokens[0].friend_id}]);
        }, error => console.log('Could not create a new message.'));
    }
  }
}
