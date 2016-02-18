import {provide, Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {HttpClient} from '../core/http_client';
import {StringUtil, DateUtil, ListUtil} from '../core/util';
import {Observable, Subject} from 'rxjs';
import {find} from 'lodash';

@Injectable()
export class InboxService {
	static API_URL = '/api/v1/inbox/last/';
	static API_URL_MARK_READ = '/api/v1/inbox/reat_at/';

	_name: string = '';
	_counter: string = '';
	_dataStore = [];
	_limit: number = 12;
	_next: string = '';
	_total_count: number = 0;
	_offset: number = 0;
	_loading: boolean = false;
	_isListEmpty: boolean = false;
	_observer: Subject<any> = new Subject(null);
	_observerCounter: Subject<any> = new Subject(null);
	_selectedThread;

	constructor(private http: HttpClient) {

	}

	public startLoadingInbox() {
		this._loadInbox(this._limit);
	}

	public serviceCounterObserver(): Subject<any> {
		return this._observerCounter;
	}

	public serviceObserver(): Subject<any> {
		return this._observer;
	}

	public loadMore() {
		this._loadInbox(this._limit);
	}

	public select(id) {
		this._selectedThread = parseInt(id, 10);
		this.markRead(parseInt(id, 10));
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

	public refreshInbox() {
		this._next = '';
		this._dataStore = [];
		this._isListEmpty = false;
		this._loadInbox(this._limit);
	}

	public addSender(id) {
		let url = `${InboxService.API_URL}?format=json&sender_id=${id}`;
		let channel = this.http.get(url)
			.map((res: any) => res.json())
			.subscribe((data: any) => {
				let item = {
					name: data.objects[0].first_name,
					threadId: parseInt(data.objects[0].friend_id, 10),
					facebookId: data.objects[0].facebook_id,
					image: data.objects[0].image,
					senderId: data.objects[0].sender_id !== null ? data.objects[0].sender_id : '/api/v1/auth/user/' + data.objects[0].friend_id + '/',
					sentAt: data.objects[0].sent_at !== null ? (DateUtil.isBeforeToday(data.objects[0].sent_at) ? DateUtil.format(data.objects[0].sent_at, 'll') : DateUtil.fromNow(data.objects[0].sent_at)) : '',
					date: data.objects[0].sent_at !== null ? data.objects[0].sent_at : '',
					readAt: data.objects[0].read_at,
					id: data.objects[0].id,
					unread: data.objects[0].unread_counter !== null && data.objects[0].unread_counter > 0 ? true : false,
					unreadCounter: data.objects[0].unread_counter,
					body: data.objects[0].last_message_body !== null ? StringUtil.words(data.objects[0].last_message_body, 50) : ''
				};

				let idx = ListUtil.findIndex(this._dataStore, { 'threadId': item.threadId });
				if (idx === -1) {
					this._dataStore = [item, ...this._dataStore];
				}
				else {
					this._dataStore[idx] = item;
				}

				this._dataStore = ListUtil.orderBy(this._dataStore, ['date'], ['desc']);

				this._counter = this._counter + 1;
				this._updateCounter();

				this._notify();

				channel.unsubscribe();
			},
			(error) => {
				console.log(`Could not load last message for one sender ${error}`);
			},
			() => {

			});

	}

	public markRead(sender) {
		let url = `${InboxService.API_URL_MARK_READ}?format=json&sender_id=${sender}`;

		let channel = this.http.get(url)
			.map((res: any) => res.json())
			.subscribe((data: any) => {

				for (var i = 0; i < this._dataStore.length; ++i) {
					if (this._dataStore[i].threadId === parseInt(sender, 10)) {
						this._dataStore[i].unread = false;
						this._dataStore[i].unreadCounter = 0;
					}
				}

				this._notify();
				channel.unsubscribe();
			},
			(error) => {
				console.log(`Could not mark message read ${error}`);
			},
			() => {

			});
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
				threadId: parseInt(data.objects[i].friend_id, 10),
				facebookId: data.objects[i].facebook_id,
				image: data.objects[i].image,
				senderId: data.objects[i].sender_id !== null ? data.objects[i].sender_id : '/api/v1/auth/user/' + data.objects[i].friend_id + '/',
				sentAt: data.objects[i].sent_at !== null ? (DateUtil.isBeforeToday(data.objects[i].sent_at) ? DateUtil.format(data.objects[i].sent_at, 'll') : DateUtil.fromNow(data.objects[i].sent_at)) : '',
				readAt: data.objects[i].read_at,
				date: data.objects[i].sent_at !== null ? data.objects[0].sent_at : '',
				id: data.objects[i].id,
				unread: data.objects[i].unread_counter !== null && data.objects[i].unread_counter > 0 ? true : false,
				unreadCounter: data.objects[i].unread_counter,
				body: data.objects[i].last_message_body !== null ? StringUtil.words(data.objects[i].last_message_body, 50) : ''
			};

			let idx = ListUtil.findIndex(this._dataStore, { 'threadId': item.threadId });
			if (idx === -1) {
				this._dataStore = [...this._dataStore, item];
			}
			else {
				this._dataStore[idx] = item;
			}
		}
		this._dataStore = ListUtil.orderBy(this._dataStore, ['date'], ['desc']);
		this._loading = false;
		this._counter = data.meta.total_count;
		this._updateCounter();

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

	private _updateCounter() {
		this._observerCounter.next(this._counter);
	}

}

export var inboxServiceInjectables: any[] = [
	provide(InboxService, { useClass: InboxService })
];
