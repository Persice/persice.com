import { Injectable, Injector } from '@angular/core';
import { Oauth1 } from './oauth1';
import { Oauth2 } from './oauth2';
import { Shared } from './shared';
import { Http, Response, RequestOptionsArgs } from '@angular/http';
import { joinUrl } from './utils';
import { Config } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class Oauth {
  constructor(
    private http: Http,
    private injector: Injector,
    private shared: Shared,
    private config: Config
  ) {}

  authenticate(name: string, userData?: any): Observable<any> {
    // var injector = Injector.resolveAndCreate([Oauth1, Oauth2]);
    let provider: any | Oauth1 | Oauth2 = this.config.providers[name].type === '1.0' ? this.injector.get(Oauth1) : this.injector.get(Oauth2);
    return <any> provider.open(this.config.providers[name], userData || {})
      .do((response: Response) => {
        // this is for a scenario when someone wishes to opt out from
        // satellizer's magic by doing authorization code exchange and
        // saving a token manually.
        if (this.config.providers[name].url) {
          this.shared.setToken(response);
        }
      });
  }

  unlink(provider: string, opts: RequestOptionsArgs) {
    opts = opts || {};
    let url = opts.url ? opts.url : joinUrl(this.config.baseUrl, this.config.unlinkUrl);
    opts.body = JSON.stringify({provider: provider}) || opts.body;
    opts.method = opts.method || 'POST';

    return this.http.request(url, opts);
  }
}
