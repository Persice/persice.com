import {provide, Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Subject, Observable} from 'rxjs';
import {HttpClient} from '../core';

@Injectable()
export class ProfileService {
  static API_URL: string = '/api/v1/profile';
  static DEFAULT_IMAGE: string = '/static/assets/images/empty_avatar.png';

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

  public ofUsername(username: string): Observable<any> {
    let url = this.buildUrl(username);

    return this.http.get(url).map((res: Response) => res.json().objects[0]);
  }

  private _findByUri(username: string) {
    if (this._loading) {
      return;
    }

    let url = this.buildUrl(username);

    this._loading = true;
    this._notFound = false;
    this._notify();
    let channel = this.http.get(url)
      .map((res: Response) => res.json())
      .subscribe((res: any) => {
        this._loading = false;
        if (res.meta.total_count === 1) {
          this._dataStore = res.objects[0];
        } else {
          this._notFound = true;
        }
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

  private buildUrl(username: string) {
    return `${ProfileService.API_URL}/?format=json&username=${username}`;
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
