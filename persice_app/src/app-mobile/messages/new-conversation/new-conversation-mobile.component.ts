import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location, Control} from '@angular/common';
import {Router, RouteParams} from '@angular/router-deprecated';
import {Subscription, Observable} from 'rxjs';

import {AppStateService} from "../../shared/services/app-state.service";
import {MessagesService} from "../../../app/shared/services/messages.service";
import {InboxService} from "../../../app/shared/services/inbox.service";
import {UserAuthService} from "../../../app/shared/services/userauth.service";
import {Http} from "@angular/http";

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
  recipientName: string;
  recipientNameInput = new Control();
  possibleRecipients: any[];

  constructor(
    private appStateService: AppStateService,
    private _location: Location,
    private inboxService: InboxService,
    private messagesService: MessagesService,
    private userService: UserAuthService,
    private _router: Router,
    private _params: RouteParams,
    public http: Http
  ) {
    // Get recipient from URL, if any.
    this.recipientId = this._params.get('recipientId');

    // Setup debouncer on recipient input field.
    this.recipientNameInput.valueChanges
      .debounceTime(400)
      .subscribe(() => this.searchRecipientsByPartialName());

    // Preselect a recipient, if any.
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

  // Send a message.
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

  // Search for a connection with a given name.
  public searchRecipientsByPartialName() {
    this._rawSearch(this.recipientName).subscribe(data => {
      this.possibleRecipients = data.objects;
    });
  }

  // Select a recipient, clear input fields.
  private selectRecipient(recipient: any) {
    this.tokens = [{
      first_name: recipient.first_name,
      image: recipient.image,
      friend_id: recipient.friend_id
    }];
    this.possibleRecipients = [];
    this.recipientName = '';
  }

  // Remove a recipient with a given index.
  private removeRecipient(i: number) {
    this.tokens.splice(i, 1);
  }

  // Perform a connection to backend and retrieve possible recipients.
  private _rawSearch(term: string): Observable<any> {
    let url = `/api/v1/connectionssearch/?format=json&first_name=${term}`;
    return this.http
      .get(url)
      .map(response => response.json());
  }
}
