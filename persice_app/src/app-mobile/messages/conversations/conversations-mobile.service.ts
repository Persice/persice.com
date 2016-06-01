import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {HttpClient} from '../../../app/shared/core';
import {Conversation} from '../../../common/models';
import {ConversationActions} from '../../../common/actions';
import {AppState, getConversationsState} from '../../../common/reducers';

@Injectable()
export class ConversationsMobileService {

  static API_URL = '/api/v1/inbox/last/';
  static API_URL_MARK_READ = '/api/v1/inbox/reat_at/';

  public conversations$: Observable<Conversation[]>;
  public loading$: Observable<boolean>;
  public count$: Observable<number>;

  private _next: string = '';
  private _loading: boolean;

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private actions: ConversationActions
    ) {
    const store$ = store.let(getConversationsState());

    this.conversations$ = store$.map(state => state['items']);
    this.loading$ = store$.map(state => state['loading']);
  }

  loadConversations() {
    if (this._loading || this._next === null) {
      return;
    }

    let url = '';

    if (this._next === '') {
      let params: string = [
        `format=json`,
        `limit=12`,
        `offset=0`
      ].join('&');

      url = `${ConversationsMobileService.API_URL}?${params}`;
    } else {
      url = this._next;
    }
    this._loading = true;

    this.http.get(url)
      .do(() => this.store.dispatch(this.actions.loadingCollection(true)))
      .map((res: any) => res.json())
      .subscribe((dto: any) => {
        const meta = dto.meta;
        const objects = dto.objects;

        const data = {
          conversations: this.assignData(objects),
          count: meta.total_count
        };

        this.store.dispatch(this.actions.loadCollectionSuccess(data));

        this._loading = false;
        this._next = meta.next;
      });

  }

  assignData(dtoArray: any[]) {
    let items: Conversation[] = [];
    for (var i = 0; i < dtoArray.length; ++i) {
      let item = new Conversation(dtoArray[i]);
      items = [...items, item];
    }
    return items;
  }
}
