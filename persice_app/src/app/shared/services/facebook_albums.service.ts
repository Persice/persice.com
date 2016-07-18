import { provide, Injectable } from '@angular/core';
import { HttpClient } from '../core';
import { CookieUtil } from '../core/util';
import { Subject } from 'rxjs';

@Injectable()
export class FacebookAlbumsService {
  static API_URL = 'https://graph.facebook.com/v2.6/me/?fields=albums.limit(4){picture, count, name, photos.limit(6){name,images,picture}}';

  _limitPhotos: number = 6;
  _limitAlbums: number = 4;
  _dataStore: any = [];
  _limit: number = 4;
  _next: string = '';
  _total_count: number = 0;
  _offset: number = 0;
  _loading: boolean = false;
  _isListEmpty: boolean = false;
  _observer: Subject<any> = new Subject(null);
  _token: string;
  _loadingMorePhotos = false;

  constructor(private http: HttpClient) {
    this._token = CookieUtil.getValue('user_token');
  }

  public startLoadingAlbums(limitAlbums?: number, limitPhotos?: number) {
    if (!!limitAlbums) {
      this._limitAlbums = limitAlbums;
    }
    if (!!limitPhotos) {
      this._limitPhotos = limitPhotos;
    }

    this._loadAlbums();
  }

  public serviceObserver(): Subject<any> {
    return this._observer;
  }

  public loadMore() {
    this._loadAlbums();
  }

  public startLoadingPhotos() {
    this._notify();
  }

  public getAlbumPhotos(albumId: number): any {
    let photos = {};

    for (var i = 0; i < this._dataStore.length; ++i) {
      if (this._dataStore[i].id === albumId) {
        photos = this._dataStore[i].photos;
      }
    }

    return photos;
  }

  public loadMorePhotos(albumId) {
    if (this._loadingMorePhotos) {
      return;
    }
    this._loadingMorePhotos = true;
    for (var i = 0; i < this._dataStore.length; ++i) {
      if (this._dataStore[i].id === albumId) {
        if (this._dataStore[i].photos.paging.next) {
          this._loadPhotos(i);
        }
      }
    }
  }

  public getData() {
    return this._dataStore;
  }

  private _loadPhotos(index) {
    this._loadingMorePhotos = true;
    this._notify();
    let url = this._dataStore[index].photos.paging.next;
    url = url.replace(/limit\=6/, 'limit=12');
    let channel = this.http.get(url)
      .map((res: any) => res.json())
      .subscribe((data: any) => {
          try {
            this._dataStore[index].photos.data = [...this._dataStore[index].photos.data, ...data.data];
            this._dataStore[index].photos.paging = data.paging;
            this._loadingMorePhotos = false;
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
          console.log(`Could not load facebook album photos ${error}`);
        },
        () => {

        });
  }

  private _loadAlbums() {

    if (this._loading) {
      return;
    }

    if (this._next === null) {
      return;
    }

    let url = '';
    if (this._next === '') {
      let params: string = [
        `access_token=${this._token}`
      ].join('&');

      let urlFB = `https://graph.facebook.com/v2.6/me/?fields=albums.limit(${this._limitAlbums}){picture, count, name, photos.limit(${this._limitPhotos}){name,images,picture}}`;
      url = `${urlFB}&${params}`;

    } else {
      url = this._next;
    }

    this._loading = true;
    this._notify();
    let channel = this.http.get(url)
      .map((res: any) => res.json())
      .subscribe((data: any) => {
          try {
            this._loading = false;
            this._isListEmpty = false;
            if (this._dataStore.length === 0) {
              this._dataStore = data.albums.data;
              this._next = data.albums.paging.hasOwnProperty('next') ? data.albums.paging.next : null;

            } else {
              this._dataStore = [...this._dataStore, ...data.data];
              this._next = data.paging.hasOwnProperty('next') ? data.paging.next : null;
            }
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

  private _notify() {
    this._observer.next({
      loading: this._loading,
      data: this._dataStore,
      finished: this._next === null ? true : false,
      isEmpty: this._isListEmpty,
      loadingPhotos: this._loadingMorePhotos,
      next: this._next
    });
  }

}

export var facebookAlbumsServiceInjectables: any[] = [
  provide(FacebookAlbumsService, {useClass: FacebookAlbumsService})
];
