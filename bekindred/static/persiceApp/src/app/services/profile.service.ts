import {provide, Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operator/map';
import {HttpClient} from '../core/http_client';


@Injectable()
export class ProfileService {
  static API_URL: string = '';
  static DEFAULT_IMAGE: string = '/static/persiceApp/src/assets/images/avatar_user_m.jpg';

  _observer: Subject<any> = new Subject(null);

  _dataStore = {};
  _loading: boolean = false;
  _notFound: boolean = false;

  constructor(private http: HttpClient) {

  }

  public loadProfile(resourceUri) {
    this._findByUri(resourceUri);
  }

  public serviceObserver(): Subject<any> {
    return this._observer;
  }

  private _findByUri(resourceUri: string) {
    if (this._loading) {
      return;
    }

    this._loading = true;
    this._notFound = false;
    this._notify();
    let channel = this.http.get(resourceUri)
      .map((res: Response) => res.json())
      .subscribe((res: any) => {
        this._loading = false;
        this._dataStore = res;
        this._notify();
        channel.unsubscribe();
      }, (err) => {
        this._notFound = true;
        this._loading = false;
        console.log(`Could not load profile ${err}`);
        this._notify();
        channel.unsubscribe();
      });
  }

  private _notify() {
    this._observer.next({
      loading: this._loading,
      data: this._dataStore,
      notFound: this._notFound
    });
  }
}

export var profileServiceInjectables: Array<any> = [
  provide(ProfileService, { useClass: ProfileService })
];

