import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Auth } from '../../../common/auth/auth';

@Injectable()
export class HttpClient {

  constructor(private http: Http, private router: Router, private auth: Auth) {

  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setHeaders(options || {});
    return this.http.get(url, options)
      .catch((err) => this.handleError(err));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    options = options || {};
    return this.http.post(url, body, options)
      .catch((err) => this.handleError(err));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setHeaders(options || {});
    return this.http.put(url, body, options)
      .catch((err) => this.handleError(err));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setHeaders(options || {});
    return this.http.delete(url, options)
      .catch((err) => this.handleError(err));
  }

  patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setHeaders(options || {});
    return this.http.patch(url, body, options)
      .catch((err) => this.handleError(err));
  }

  head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setHeaders(options || {});
    return this.http.head(url, options)
      .catch((err) => this.handleError(err));
  }

  private setHeaders(obj: { headers?: Headers, [index: string]: any }) {
    obj.headers = obj.headers || new Headers();

    if (this.auth.isAuthenticated()) {
      obj.headers.set('Authentication', 'Bearer ' + this.auth.getToken());
    }

    return obj;
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    // If user is NOT authenticated, logout and clear token from local storage
    if (error.status === 401) {

      console.log('Error 401: Not Authenticated ', errMsg);
      this.auth.logout().subscribe((res) => {
        this.router.navigateByUrl('/login');
      });
    }

    return Observable.throw(errMsg);
  }

}
