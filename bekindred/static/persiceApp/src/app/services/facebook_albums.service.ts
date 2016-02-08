import {provide, Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {HttpClient} from '../core/http_client';
import {StringUtil, DateUtil, ListUtil, CookieUtil} from '../core/util';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class FacebookAlbumsService {
	static API_URL = 'https://graph.facebook.com/me/?fields=albums.limit(30){picture, name, photos.limit(6)}';


	_dataStore = [];
	_limit: number = 12;
	_next: string = '';
	_total_count: number = 0;
	_offset: number = 0;
	_loading: boolean = false;
	_isListEmpty: boolean = false;
	_observer: Subject<any> = new Subject(null);
	_token: string;

	constructor(private http: HttpClient) {
		this._token = CookieUtil.getValue('user_token');
	}

	public startLoadingAlbums() {
		this._loadAlbums();
	}

	public serviceObserver(): Subject<any> {
		return this._observer;
	}

	public loadMore() {
		this._loadAlbums();
	}


	public getData() {
		return this._dataStore;
	}

	private _loadAlbums() {

		if (this._loading || this._next === null) {
			return;
		}

		let url = '';


		if (this._next === '') {
			let params: string = [
				`access_token=${this._token}`
			].join('&');

			url = `${FacebookAlbumsService.API_URL}&${params}`;
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
					this._dataStore = data.albums.data;
					this._loading = false;
					this._isListEmpty = false;
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
				console.log(`Could not load facebook albums ${error}`);
			},
			() => {

			});
	}



	private _parseData(data) {
		for (var i = 0; i < data.objects.length; ++i) {
			let item = {

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
			next: this._next
		});
	}

}

export var facebookAlbumsServiceInjectables: any[] = [
	provide(FacebookAlbumsService, { useClass: FacebookAlbumsService })
];
