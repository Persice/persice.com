import {Injectable} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {HttpClient, CookieUtil, OPTS_REQ_JSON_CSRF} from '../../../app/shared/core';
import {Message, Conversation} from '../../../common/models';
import {MessageActions} from '../../../common/actions';
import {AppState, getMessagesState, getConversationsState} from '../../../common/reducers';

const PER_PAGE_LIMIT: number = 12;

@Injectable()
export class MessagesMobileService {

  static API_URL = '/api/v1/messages/';
  static API_USER_URL = '/api/v1/auth/user/';
  static API_URL_MARK_READ = '/api/v1/inbox/reat_at/';

  public messages$: Observable<Message[]>;
  public loading$: Observable<boolean>;
  public totalCount$: Observable<number>;
  public loaded$: Observable<boolean>;
  public loadedCount$: Observable<number>;
  public selectedConversation$: Observable<Conversation>;
  public conversationTitle$: Observable<string>;
  public isNewMessageBeingSent$: Observable<boolean>;

  private _next: string = '';
  private _loading: boolean;

  private _me: string;

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private actions: MessageActions
  ) {
    const userId: string = CookieUtil.getValue('userid');
    this._me = `/api/v1/auth/user/${userId}/`;

    const storeMessages$ = store.let(getMessagesState());
    const storeConversations$ = store.let(getConversationsState());

    this.messages$ = storeMessages$.map(state => state['entities']);
    this.loading$ = storeMessages$.map(state => state['loading']);
    this.totalCount$ = storeMessages$.map(state => state['totalCount']);
    this.loaded$ = storeMessages$.map(state => state['loaded']);
    this.loadedCount$ = storeMessages$.map(state => state['loadedCount']);
    this.conversationTitle$ = storeMessages$.map(state => state['conversationTitle']);
    this.isNewMessageBeingSent$ = storeMessages$.map(state => state['isNewMessageBeingSent']);
    this.selectedConversation$ = storeConversations$.map(state => state['selectedItem']);
  }

  public emptyConversationMessages() {
    this.store.dispatch(this.actions.resetCollection());
  }

  public loadConversationTitle(senderId: string) {
    const params: string = [
      `format=json`,
    ].join('&');
    const url = `${MessagesMobileService.API_USER_URL}${senderId}/?${params}`;
    let subs: Subscription = this.http.get(url)
      .map((res: any) => res.json())
      .subscribe((dto: any) => {
        const name: string = dto.first_name;
        this.store.dispatch(this.actions.loadedConversationTitle(name));
        subs.unsubscribe();
      });
  }

  public markConversationRead(senderId: string): Observable<any> {
    let url: string = `${MessagesMobileService.API_URL_MARK_READ}?format=json&sender_id=${senderId}`;
    return this.http.get(url)
      .map((res: any) => res.json());
  }

  public loadMessages(senderId: string) {
    if (this._loading || this._next === null) {
      return;
    }
    let url = '';
    if (this._next === '') {
      let params: string = [
        `format=json`,
        `limit=${PER_PAGE_LIMIT}`,
        `user_id=${senderId}`,
        `order_by=-sent_at`,
        `offset=0`
      ].join('&');
      url = `${MessagesMobileService.API_URL}?${params}`;
    } else {
      url = this._next;
    }
    this._loading = true;
    this.store.dispatch(this.actions.loadingCollection(true));
    let subs = this.http.get(url)
      .map((res: any) => res.json())
      .subscribe((dto: any) => {
        const meta = dto.meta;
        const objects = dto.objects;

        const data = {
          messages: Message.getCollection(objects),
          count: meta.total_count
        };

        this.store.dispatch(this.actions.loadCollectionSuccess(data));

        if (this._next !== null && this._next.length > 0) {
          this.store.dispatch(this.actions.moreItemsLoaded(data.messages.length));
        }

        if (this._next === null) {
          this.store.dispatch(this.actions.collectionFullyLoaded());
        }

        this._loading = false;
        this._next = meta.next;
        subs.unsubscribe();
      });
  }

  public sendMessage(recipientId: string, message: string): void {
    let recipient: string = `/api/v1/auth/user/${recipientId}/`;
    let url = `${MessagesMobileService.API_URL}?format=json`;
    let data = {
      body: message,
      recipient: recipient,
      sender: this._me
    };
    this.store.dispatch(this.actions.sendingNewMessage());
    let subs: Subscription = this.http.post(url, JSON.stringify(data), OPTS_REQ_JSON_CSRF)
      .map((res: any) => res.json())
      .subscribe((dto: any) => {
        const data = new Message(dto);
        this.store.dispatch(this.actions.addNewMessageToCollectionSuccess(data));
        subs.unsubscribe();
      });
  }

  public recievedMessageViaWebSocket(dto: any, senderId: string) {
    let expectedSender = `/api/v1/auth/user/${senderId}/`;
    if (dto.recipient === this._me && dto.sender === expectedSender) {
      const data = new Message(dto);
      this.store.dispatch(this.actions.addNewMessageToCollectionViaWebsocketSuccess(data));
    }
  }

}
