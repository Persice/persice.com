import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location, Control} from '@angular/common';
import {Router} from '@angular/router-deprecated';
import {Subscription, Observable} from 'rxjs';
import {Http} from '@angular/http';
import {Store} from '@ngrx/store';
import {SelectedPersonActions} from '../../../common/actions';
import {AppState, getSelectedPersonState} from '../../../common/reducers';

import {AppStateService} from '../../shared/services';
import {NewConversationMobileService} from './new-conversation-mobile.service';

import {CheckImageDirective} from '../../../app/shared/directives';

@Component({
  selector: 'prs-mobile-new-conversation',
  template: require('./new-conversation-mobile.html'),
  providers: [NewConversationMobileService],
  directives: [CheckImageDirective]
})
export class NewConversationMobileComponent implements OnInit, OnDestroy {

  tokens: any[] = [];
  messageText: string = '';
  recipientName: string;
  recipientNameInput = new Control();
  possibleRecipients: any[] = [];

  private selectedPersonState$: Observable<any>;
  private recipientIsAlreadySelected: boolean = false;

  constructor(
    private appStateService: AppStateService,
    private _location: Location,
    private _router: Router,
    private http: Http,
    private service: NewConversationMobileService,
    private store: Store<AppState>,
    private actions: SelectedPersonActions
  ) {
    this.selectedPersonState$ = store.let(getSelectedPersonState());

    this.selectedPersonState$.subscribe((state: any) => {
      // Preselect a recipient, if it was previously selected.
      if (state.selected && state.useAsNewConversationRecipient) {
        this.recipientIsAlreadySelected = true;
        this.tokens.push({
          first_name: state.person.first_name,
          image: state.person.image,
          friend_id: state.person.id
        });
      } else {
        this.recipientIsAlreadySelected = false;
      }
    });

    // Setup debouncer on recipient input field.
    this.recipientNameInput.valueChanges
      .debounceTime(400)
      .subscribe(() => this.searchRecipientsByPartialName());

  }

  ngOnInit(): any {
    this.appStateService.setHeaderVisibility(false);
  }

  ngOnDestroy(): any {
    this.appStateService.setHeaderVisibility(true);

    // If recipient was already selected, clear selected person from App Store.
    if (this.recipientIsAlreadySelected) {
      this.store.dispatch(this.actions.clear());
    }

  }

  public back() {
    this._location.back();
  }

  // Send a message.
  public send() {
    if (this.tokens.length === 1 && this.messageText.length > 0) {
      let subs: Subscription = this.service.sendMessage(this.tokens[0].friend_id, this.messageText)
        .subscribe((dto: any) => {
          this.service.messageSent();
          subs.unsubscribe();
          this._router.parent.navigate(['/Messages', 'Conversation', { senderId: this.tokens[0].friend_id }]);
        }, error => {
          subs.unsubscribe();
          this.service.messageNotSent();
        });
    }
  }

  // Search for a connection with a given name.
  public searchRecipientsByPartialName() {
    let subs: Subscription = this._rawSearch(this.recipientName).subscribe(data => {
      this.possibleRecipients = data.objects;
      subs.unsubscribe();
    });
  }

  // Select a recipient, clear input fields.
  public selectRecipient(recipient: any) {
    this.tokens = [{
      first_name: recipient.first_name,
      image: recipient.image,
      friend_id: recipient.friend_id
    }];
    this.possibleRecipients = [];
    this.recipientName = '';
  }

  // Remove a recipient with a given index.
  public removeRecipient(i: number) {
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
