import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {HttpClient} from '../../../app/shared/core';
import {Conversation} from '../../../common/models';
import {ConversationActions} from '../../../common/actions';
import {AppState, getConversationsState} from '../../../common/reducers';

const PER_PAGE_LIMIT: number = 12;

@Injectable()
export class ConversationsMobileService {

  static API_URL = '/api/v1/inbox/last/';
  static API_URL_MARK_READ = '/api/v1/inbox/reat_at/';

  public conversations$: Observable<Conversation[]>;
  public loading$: Observable<boolean>;
  public loaded$: Observable<boolean>;

  private _next: string = '';
  private _loading: boolean;

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private actions: ConversationActions
  ) {
    const store$ = store.let(getConversationsState());

    this.conversations$ = store$.map(state => state['entities']);
    this.loading$ = store$.map(state => state['loading']);
    this.loaded$ = store$.map(state => state['loaded']);
  }

  public emptyConversations(): void {
    this.store.dispatch(this.actions.resetCollection());
  }

  public markConversationRead(senderId: string): void {
    let url: string = `${ConversationsMobileService.API_URL_MARK_READ}?format=json&sender_id=${senderId}`;
    this.http.get(url)
      .map((res: any) => res.json())
      .subscribe((data: any) => { });
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
      url = `${ConversationsMobileService.API_URL}?${params}`;
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

        if (this._next === null) {
          this.store.dispatch(this.actions.collectionFullyLoaded());
        }

        this._loading = false;
        this._next = meta.next;
      });

  }

}
