import { Injectable } from '@angular/core';
import {
  Http,
  RequestMethod,
  Response,
  RequestOptionsArgs,
  Headers,
  Request,
  RequestOptions,
  ConnectionBackend
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from './config';
import { Shared } from './shared';
import { Router } from '@angular/router';

@Injectable()
export class JwtHttp extends Http {
  constructor(
    _backend: ConnectionBackend,
    _defaultOptions: RequestOptions,
    private _shared: Shared,
    private _config: Config,
    private _router: Router
  ) {
    super(_backend, _defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (url instanceof Request) {
      url.headers = url.headers || new Headers();
      this.setHeaders(url);
    } else {
      options = options || {};
      this.setHeaders(options);
    }

    return super.request(url, options)
      .catch((err) => this.handleError(err));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = options || {};
    options.method = RequestMethod.Get;
    return this.request(url, options);
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    options = options || {};
    options.method = RequestMethod.Post;
    options.body = body;
    return this.request(url, options);
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    options = options || {};
    options.method = RequestMethod.Put;
    options.body = body;
    return this.request(url, options);
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = options || {};
    options.method = RequestMethod.Delete;
    return this.request(url, options);
  }

  patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    options = options || {};
    options.method = RequestMethod.Patch;
    options.body = body;
    return this.request(url, options);
  }

  head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = options || {};
    options.method = RequestMethod.Head;
    return this.request(url, options);
  }

  private setHeaders(obj: { headers?: Headers, [index: string]: any }) {
    obj.headers = obj.headers || new Headers();
    if (this._config.defaultHeaders) {
      Object.keys(this._config.defaultHeaders).forEach((defaultHeader) => {
        if (!obj.headers.has(defaultHeader)) {
          obj.headers.set(defaultHeader, this._config.defaultHeaders[defaultHeader]);
        }
      });
    }
    if (this._shared.isAuthenticated()) {
      obj.headers.set(this._config.authHeader, this._config.authToken + ' ' + this._shared.getToken());
    }
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(error.status);
    // If user is NOT authenticated, logout and clear token from local storage
    if (error.status === 401) {

      console.log('Error 401: Not Authenticated ', errMsg);
      this._shared.logout().subscribe((res) => {
        this._router.navigateByUrl('/login');
      });
    }

    return Observable.throw(errMsg);

  }

}
