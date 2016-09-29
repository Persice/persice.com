import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { HeaderState } from '../../header';
import { NewConversationService } from '../../../../common/services/new-conversation.service';
import { AppStateService } from '../../../shared/services';
import { HttpClient } from '../../../../common/core';
import { AppState, getSelectedPersonState } from '../../../../common/reducers';
import { SelectedPersonActions } from '../../../../common/actions';

@Component({
  selector: 'prs-mobile-new-conversation',
  templateUrl: './new-conversation-mobile.html',
  providers: [ NewConversationService ],
})
export class NewConversationMobileComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('recipientNameInput') recipientNameInput: ElementRef;
  tokens: any[] = [];
  messageText: string = '';
  recipientName: string;
  possibleRecipients: any[] = [];

  private selectedPersonState$: Observable<any>;
  private recipientIsAlreadySelected: boolean = false;
  private sendNewMessageSub: Subscription;

  constructor(
    private appStateService: AppStateService,
    private _router: Router,
    private http: HttpClient,
    private service: NewConversationService,
    private store: Store<AppState>,
    private actions: SelectedPersonActions
  ) {
    this.selectedPersonState$ = store.let(getSelectedPersonState());

    this.selectedPersonState$.subscribe((state: any) => {
      // Preselect a recipient, if it was previously selected.
      if (state.selected) {
        this.recipientIsAlreadySelected = true;
        this.tokens.push({
          first_name: state.person.firstName,
          image: state.person.image,
          friend_id: state.person.id
        });
      } else {
        this.recipientIsAlreadySelected = false;
      }
    });

  }

  ngAfterViewInit(): any {
    // Setup debouncer on recipient input field.
    Observable.fromEvent(this.recipientNameInput.nativeElement, 'keyup', null, null)
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(() => this.searchRecipientsByPartialName());
  }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit(HeaderState.newConversation);
    this.sendNewMessageSub = this.appStateService.sendMessageEmitter.subscribe(() => {
      this.send();
    });
  }

  ngOnDestroy(): any {
    if (this.sendNewMessageSub) {
      this.sendNewMessageSub.unsubscribe();
    }
    // If recipient was already selected, clear selected person from App Store.
    if (this.recipientIsAlreadySelected) {
      this.store.dispatch(this.actions.clear());
    }

  }

  // Send a message.
  public send() {
    if (this.tokens.length === 1 && this.messageText.length > 0) {
      let subs: Subscription = this.service.sendMessage(this.tokens[ 0 ].friend_id, this.messageText)
        .subscribe((dto: any) => {
          this.service.messageSent();
          subs.unsubscribe();
          this._router
            .navigateByUrl('messages/' + this.tokens[ 0 ].friend_id);
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
    this.tokens = [ {
      first_name: recipient.first_name,
      image: recipient.image,
      friend_id: recipient.friend_id
    } ];
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
