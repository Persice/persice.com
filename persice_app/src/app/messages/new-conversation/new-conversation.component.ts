import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConversationInputComponent } from '../conversation-input';
import { NewConversationHeaderComponent } from './new-conversation-header.component';
import { UserAuthService } from '../../shared/services';
import { Subscription } from 'rxjs';
import { NewConversationService } from '../../../common/messages/new-conversation.service';

@Component({
  selector: 'prs-new-conversation',
  template: <any>require('./new-conversation.html'),
  directives: [
    NewConversationHeaderComponent,
    ConversationInputComponent
  ],
  providers: [ NewConversationService ]
})
export class NewConversationComponent implements OnInit, OnDestroy {
  private tokens: any[] = [];
  private initialTokens: any[] = [];
  private message: string = '';
  private friendId: string;
  private routerSub: Subscription;

  constructor(
    private messagesService: NewConversationService,
    private userService: UserAuthService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): any {
    this.routerSub = this._route.params.subscribe((params) => {
      this.friendId = params['friendId'];
      //preselect a connection
      if (!!this.friendId && this.friendId !== 'new') {
        let uri = `/api/v1/auth/user/${this.friendId}/`;
        let channel = this.userService.findOneByUri(uri)
          .subscribe(data => {
            this.initialTokens = [{
              first_name: data.first_name,
              image: data.image,
              friend_id: this.friendId
            }];
            channel.unsubscribe();
          }, () => console.log('user could not be found'));
      }
    });
  }

  ngOnDestroy(): any {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  private sendMessage(message): void {
    if (this.tokens.length === 1) {
      let channel = this.messagesService.sendMessage(this.tokens[0].friend_id, message)
        .subscribe(() => {
          this.messagesService.messageSent();
          channel.unsubscribe();
          this._router.navigateByUrl('/messages/' + this.tokens[0].friend_id);
        }, () => {
          this.messagesService.messageNotSent();
          channel.unsubscribe();
          console.log('Could not create new message.');
        });
    }
  }
}
