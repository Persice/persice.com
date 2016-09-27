import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IntercomUtil } from '../core/util';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class HttpClient {

  constructor(private http: Http, private router: Router, private auth: AuthService) {

  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setHeaders(options || {});
    return this.http.get(url, options)
      .catch((err) => this.handleError(err));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setHeaders(options || {});
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

    // Check 'Content-Type' header is set and set default to 'application/json'
    if (obj.headers.has('Content-Type')) {
      // Unset 'Content-Type' header when uploading a file via multipart/form-data
      if (obj.headers.get('Content-Type') === 'multipart/form-data') {
        obj.headers.delete('Content-Type');
      }
    } else {
      obj.headers.set('Content-Type', 'application/json');
    }

    if (this.auth.isAuthenticated()) {
      obj.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }

    return obj;
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    // If user is NOT authenticated, logout and clear token from local storage
    if (error.status === 401) {
      this.auth.logout().subscribe((res) => {
        IntercomUtil.shutdown();
        this.router.navigateByUrl('/login');
      });
    }

    // console.log('API Response Error: ', errMsg);

    return Observable.throw(errMsg);
  }

}
