import {provide, Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {HttpClient} from '../core/http_client';
import {StringUtil, DateUtil, ListUtil} from '../core/util';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class InboxService {
	static API_URL = '/api/v1/inbox/last/';


	_dataStore = [];
	_limit: number = 12;
	_next: string = '';
	_total_count: number = 0;
	_offset: number = 0;
	_loading: boolean = false;
	_isListEmpty: boolean = false;
	_observer: Subject<any> = new Subject(null);
	_selectedThread;

	constructor(private http: HttpClient) {

	}

	public startLoadingInbox() {
		this._loadInbox(this._limit);
	}

	public serviceObserver(): Subject<any> {
		return this._observer;
	}

	public loadMore() {
		this._loadInbox(this._limit);
	}

	public select(id) {
		this._selectedThread = id;
		this._notify();
	}


	public deselectThreads() {
		this._selectedThread = null;
		this._notify();
	}

	public getSelectThread() {
		return this._selectedThread;
	}

	public getInbox() {
		return this._dataStore;
	}

	private _loadInbox(limit: number) {

		if (this._loading || this._next === null) {
			return;
		}

		let url = '';

		if (this._next === '') {
			let params: string = [
				`format=json`,
				`limit=${limit}`,
				`offset=0`
			].join('&');

			url = `${InboxService.API_URL}?${params}`;
		}
		else {
			url = this._next;
		}

		this._loading = true;
		this._notify();
		let channel = this.http.get(url)
			.map((res: any) => res.json())
			.subscribe((data: any) => {
				try {
					this._parseData(data);
					this._notify();
				} catch (e) {
					console.log('error', e);
					this._notify();
					channel.unsubscribe();
					return;
				}
				channel.unsubscribe();
			},
			(error) => {
				console.log(`Could not load inbox ${error}`);
			},
			() => {

			});
	}



	private _parseData(data) {
		for (var i = 0; i < data.objects.length; ++i) {
			let item = {
				name: data.objects[i].first_name,
				threadId: data.objects[i].friend_id,
				facebookId: data.objects[i].facebook_id,
				image: data.objects[i].image,
				sentAt: data.objects[i].sent_at !== null ? DateUtil.fromNow(data.objects[i].sent_at) : '',
				readAt: data.objects[i].read_at,
				id: data.objects[i].id,
				unread: data.objects[i].read_at !== null || data.objects[i].sent_at !== null ? true : false,
				body: data.objects[i].last_message_body !== null ? StringUtil.words(data.objects[i].last_message_body, 50) : ''
			};
			this._dataStore = [...this._dataStore, item];
		}
		this._loading = false;

		if (data.meta.total_count === 0) {
			this._isListEmpty = true;
			this._dataStore = [];
		} else {
			this._isListEmpty = false;
		}
		this._next = data.meta.next;
		this._offset = data.meta.offset;
	}

	private _notify() {
		this._observer.next({
			loading: this._loading,
			data: this._dataStore,
			finished: this._next === null ? true : false,
			isEmpty: this._isListEmpty,
			next: this._next,
			selected: this._selectedThread
		});
	}

}

export var inboxServiceInjectables: any[] = [
	provide(InboxService, { useClass: InboxService })
];
