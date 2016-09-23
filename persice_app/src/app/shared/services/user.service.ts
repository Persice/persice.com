import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthUserModel } from '../models';
import { HttpClient } from '../../../common/core';
import { TokenUtil } from '../../../common/core/util';

@Injectable()
export class UserService {
  static API_URL: string = '/api/v1/auth/user/';
  static DEFAULT_IMAGE: string = '/assets/images/empty_avatar.png';
  user: AuthUserModel;
  image: string = UserService.DEFAULT_IMAGE;
  name: string = '';

  public user$: Observable<any>;
  private _user$: BehaviorSubject<any> = new BehaviorSubject({ user: null });

  constructor(private http: HttpClient) {
    this.user$ = this._user$.asObservable();
  }

  public getProfileUpdates() {

    let params = [
      `format=json`
    ].join('&');

    let userId = TokenUtil.getValue('user_id');
    let url = `${UserService.API_URL}${userId}/?${params}`;

    let channel = this.http.get(url)
      .map((res: Response) => res.json())
      .subscribe((data) => {
          this.user = new AuthUserModel(data);
          this.image = this.user.info.image;
          this.name = this.user.info.first_name;
          this._user$.next({
            user: this.user
          });
          channel.unsubscribe();
        },
        (err) => {
          console.log('could not fetch user profile', err);
          channel.unsubscribe();
        });
  }

  public get(): Observable<any> {

    let params = [
      `format=json`
    ].join('&');

    let userId = TokenUtil.getValue('user_id');
    let url = `${UserService.API_URL}${userId}/?${params}`;

    return this.http.get(url)
      .map((res: Response) => {
        let data = res.json();
        this.user = new AuthUserModel(data);
        this.image = this.user.info.image;
        this.name = this.user.info.first_name;
        return res.json();
      });
  }

  public findOneByUri(resourceUri: string): Observable<any> {
    return this.http.get(resourceUri).map((res: Response) => res.json());
  }

  public getDefaultImage() {
    return UserService.DEFAULT_IMAGE;
  }

  public getImage() {
    return this.image;
  }

  public getName() {
    return this.name;
  }

}

export var userServiceInjectables: Array<any> = [
  { provide: UserService, useClass: UserService }
];
