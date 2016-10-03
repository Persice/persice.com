import { Injectable } from '@angular/core';
import { Response, RequestOptionsArgs } from '@angular/http';
import { SharedService } from './shared.service';
import { LocalService } from './local.service';
import { OauthService } from './oauth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  constructor(
    private shared: SharedService,
    private local: LocalService,
    private oauth: OauthService
  ) {
  }

  login(user, opts?: RequestOptionsArgs): Observable<Response> {
    return this.local.login(user, opts);
  }

  signup(user, opts?: RequestOptionsArgs): Observable<Response> {
    return this.local.signup(user, opts);
  }

  logout(): Observable<void> {
    return this.shared.logout();
  }

  isLoggingIn(): Observable<boolean> {
    return this.shared.isLoggingIn$;
  }

  authenticate(name: string, userData?: any): Observable<Response> {
    return this.oauth.authenticate(name, userData);
  }

  link(name: string, userData?: any): Observable<Response> {
    return this.oauth.authenticate(name, userData);
  }

  unlink(provider: string, opts: RequestOptionsArgs): Observable<Response> {
    return this.oauth.unlink(provider, opts);
  }

  isAuthenticated(): boolean {
    return this.shared.isAuthenticated();
  }

  getToken(): string {
    return this.shared.getToken();
  }

  setToken(token: string): void {
    this.shared.setToken(token);
  }

  removeToken(): void {
    this.shared.removeToken();
  }

  getPayload(): any {
    return this.shared.getPayload();
  }

  setStorageType(type: string): void {
    this.shared.setStorageType(type);
  }

  getExpirationDate(): Date {
    return this.shared.getExpirationDate();
  }
}
