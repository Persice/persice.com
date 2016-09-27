import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagesService } from '../../../../common/services/messages.service';
import { InboxService } from '../../../../common/services/inbox.service';
import { UserAuthService } from '../../../../common/services/userauth.service';

@Component({
  selector: 'prs-new-conversation',
  templateUrl: './new-conversation.html',
  providers: [
    MessagesService
  ]

})
export class NewConversationComponent implements OnInit, OnDestroy {
  tokens: any[] = [];
  initialTokens: any[] = [];
  message: string = '';
  friendId;
  sub;

  constructor(
    private inboxService: InboxService,
    private messagesService: MessagesService,
    private userService: UserAuthService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {

  }

  ngOnInit(): any {
    this.sub = this._route.params.subscribe((params) => {
      this.inboxService.deselectThreads();
      this.friendId = params[ 'friendId' ];
      //preselect a connection
      if (!!this.friendId && this.friendId !== 'new') {
        let uri = `/api/v1/auth/user/${this.friendId}/`;
        let channel = this.userService.findOneByUri(uri)
          .subscribe(data => {
            this.initialTokens = [ {
              first_name: data.first_name,
              image: data.image,
              friend_id: this.friendId
            } ];
            channel.unsubscribe();
          }, (err) => console.log('user could not be found'));
      }
    });
  }

  ngOnDestroy(): any {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  sendMessage(message) {
    if (this.tokens.length === 1) {
      let channel = this.messagesService.sendNew(this.tokens[ 0 ].friend_id, message)
        .subscribe(data => {
          channel.unsubscribe();
          this.inboxService.addSender(this.tokens[ 0 ].friend_id);
          this._router.navigateByUrl('/messages/' + this.tokens[ 0 ].friend_id);
        }, error => console.log('Could not create new message.'));
    }

  }
}
