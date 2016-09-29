import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Conversation } from '../models/conversation/conversation.model';
import { AppState, getConversationsState } from '../reducers/index';
import { HttpClient } from '../core/http-client';
import { ConversationActions } from '../actions/conversation.action';

const PER_PAGE_LIMIT: number = 12;

@Injectable()
export class ConversationsService {
  static API_URL = '/api/v1/inbox/last/';

  public conversations$: Observable<Conversation[]>;
  public selectedConversation$: Observable<Conversation>;
  public count$: Observable<number>;
  public loading$: Observable<boolean>;
  public loaded$: Observable<boolean>;

  private _next: string = '';
  private _loading: boolean = false;

  private selectedId: number;

  constructor(private store: Store<AppState>, private http: HttpClient, private actions: ConversationActions) {
    const store$ = store.let(getConversationsState());

    this.conversations$ = store$.map(state => state[ 'entities' ]);
    this.selectedConversation$ = store$.map(state => state[ 'selectedItem' ]);
    this.count$ = store$.map(state => state[ 'count' ]);
    this.loading$ = store$.map(state => state[ 'loading' ]);
    this.loaded$ = store$.map(state => state[ 'loaded' ]);
  }

  public resetData() {
    this._next = '';
    this._loading = false;
  }

  public emptyConversations(): void {
    this.store.dispatch(this.actions.resetCollection());
  }

  public selectConversation(conversation: Conversation): void {
    this.store.dispatch(this.actions.selectConversation(conversation));
  }

  public loadConversations(): void {
    if (this._loading || this._next === null) {
      return;
    }
    let url = '';
    if (this._next === '') {
      let params: string = [
        `format=json`,
        `limit=${PER_PAGE_LIMIT}`,
        `offset=0`
      ].join('&');
      url = `${ConversationsService.API_URL}?${params}`;
    } else {
      url = this._next;
    }
    this._loading = true;
    this.store.dispatch(this.actions.loadingCollection(true));
    this.http.get(url)
      .map((res: any) => res.json())
      .subscribe((dto: any) => {
        const meta = dto.meta;
        const objects = dto.objects;

        const data = {
          conversations: Conversation.getCollection(objects),
          count: meta.total_count
        };

        this.store.dispatch(this.actions.loadCollectionSuccess(data));

        if (this.selectedId) {
          this.store.dispatch(this.actions.selectConversationByID(this.selectedId));
          this.notifySelectedConversationRead();
          this.selectedId = null;
        }

        if (this._next === null) {
          this.store.dispatch(this.actions.collectionFullyLoaded());
        }

        this._loading = false;
        this._next = meta.next;
      });

  }

  public receivedNewMessage(data: any): void {
    if (!data.friend_id) {
      return;
    }

    const url: string = `${ConversationsService.API_URL}?format=json&sender_id=${data.friend_id}`;

    this.http.get(url)
      .map((res: any) => res.json())
      .subscribe((dto: any) => {
        if (dto.objects[ 0 ]) {
          let conversation: Conversation = new Conversation(dto.objects[ 0 ]);
          this.store.dispatch(this.actions.addNewOrReplaceExisting(conversation));
          this.notifySelectedConversationRead();
        }
      });
  }

  public setSelectedConversationId(id: number): void {
    this.selectedId = id;
  }

  public notifySelectedConversationRead(): void {
    this.store.dispatch(this.actions.markSelectedConversationRead());
  }

}
