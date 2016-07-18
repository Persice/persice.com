import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response } from '@angular/http';
import { Subject, Observable } from 'rxjs';
import { Notification } from './dto';

@Injectable()
export class HttpClient {

  requestNotifier = new Subject();

  constructor(private http: Http) { }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    this._notify({type: 'start'});
    return this.http.get(url, options)
      .map(this._mapResponse)
      .do(res => this._notify({type: 'done'}),
        err => this._notify({type: 'error', data: err}),
        () => this._notify({type: 'complete'}));
  }

  post(
    url: string,
    body: string,
    options?: RequestOptionsArgs
  ): Observable<Response> {
    this._notify({type: 'start'});
    return this.http.post(url, body, options)
      .map(this._mapResponse)
      .do(res => this._notify({type: 'done'}),
        err => this._notify({type: 'error', data: err}),
        () => this._notify({type: 'complete'}));
  }

  put(
    url: string,
    body: string,
    options?: RequestOptionsArgs
  ): Observable<Response> {
    this._notify({type: 'start'});
    return this.http.put(url, body, options)
      .map(this._mapResponse)
      .do(res => this._notify({type: 'done'}),
        err => this._notify({type: 'error', data: err}),
        () => this._notify({type: 'complete'}));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    this._notify({type: 'start'});
    return this.http.delete(url, options)
      .map(this._mapResponse)
      .do(res => this._notify({type: 'done'}),
        err => this._notify({type: 'error', data: err}),
        () => this._notify({type: 'complete'}));
  }

  patch(
    url: string,
    body: string,
    options?: RequestOptionsArgs
  ): Observable<Response> {
    this._notify({type: 'start'});
    return this.http.patch(url, body, options)
      .map(this._mapResponse)
      .do(res => this._notify({type: 'done'}),
        err => this._notify({type: 'error', data: err}),
        () => this._notify({type: 'complete'}));
  }

  /**
   * Performs a request with `head` http method.
   */
  head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    this._notify({type: 'start'});
    return this.http.head(url, options)
      .map(this._mapResponse)
      .do(res => this._notify({type: 'done'}),
        err => this._notify({type: 'error', data: err}),
        () => this._notify({type: 'complete'}));
  }

  private _notify(data: Notification) {
    this.requestNotifier.next(data);
  }

  // TODO remove this function once the angular2's http provider
  // throw errors accordingly to http codes.
  private _mapResponse(response: Response): Response {
    if (response.status >= 200 && response.status < 300) {
      //prevent empty response;
      if (response['_body'] === '') {
        response['_body'] = '{}';
      }
      return response;
    }
    const error = new Error(response['_body'] ? response['_body'] : response.statusText);
    error['response'] = response;
    console.log('HTTP error');
    console.log(error);
    if (response.status === 401) {
      window.location.href = '/accounts/logout';
    }
    ;

    throw error;
  }

}
