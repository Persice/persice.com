import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { assign, joinUrl, merge, camelCase } from './utils';
import { ConfigService, IOauth2Options } from './config.service';
import { PopupService } from './popup.service';
import { StorageService } from './storage.service';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/of';
import { JwtHttp } from './jwt-http.service';
import { SharedService } from './shared.service';

@Injectable()
export class Oauth2Service {
  private static base: IOauth2Options = {
    defaultUrlParams: [ 'response_type', 'client_id', 'redirect_uri' ],
    responseType: 'code',
    responseParams: {
      code: 'code',
      clientId: 'clientId',
      redirectUri: 'redirectUri'
    }
  };

  private defaults: IOauth2Options;

  constructor(
    private http: JwtHttp,
    private popup: PopupService,
    private storage: StorageService,
    private shared: SharedService,
    private config: ConfigService
  ) {
  }

  open(options: IOauth2Options, userData?: any) {
    this.defaults = merge(options, Oauth2Service.base);

    let url;
    let openPopup: Observable<any>;
    let stateName = this.defaults.name + '_state';
    let state = this.defaults.state;
    if (typeof state === 'string') {
      this.storage.set(stateName, state);
    } else if (typeof state === 'function') {
      this.storage.set(stateName, state());
    }

    url = [ this.defaults.authorizationEndpoint, this.buildQueryString() ].join('?');
    this.shared.isLoggingIn.next(false);

    if (this.config.cordova) {
      openPopup = this.popup
        .open(url, this.defaults.name, this.defaults.popupOptions/*, this.defaults.redirectUri*/)
        .eventListener(this.defaults.redirectUri);
    } else {
      openPopup = this.popup
        .open(url, this.defaults.name, this.defaults.popupOptions/*, this.defaults.redirectUri*/)
        .pollPopup();
    }

    return openPopup
      .concatMap((oauthData) => {
        // when no server URL provided, return popup params as-is.
        // this is for a scenario when someone wishes to opt out from
        // satellizer's magic by doing authorization code exchange and
        // saving a token manually.
        if (this.defaults.responseType === 'token' || !this.defaults.url) {
          return Observable.of(oauthData);
        }

        if (oauthData.state && oauthData.state !== this.storage.get(stateName)) {
          throw 'OAuth "state" mismatch';
        }

        return this.exchangeForToken(oauthData, userData);
      });
  }

  private exchangeForToken(oauthData: {code?, state?}, userData?: {}) {
    let data: any = assign({}, this.defaults, oauthData, userData);

    let exchangeForTokenUrl = this.config.baseUrl ? joinUrl(this.config.baseUrl, this.defaults.url) : this.defaults.url;

    this.shared.isLoggingIn.next(true);

    return this.http.post(exchangeForTokenUrl, JSON.stringify(data), { withCredentials: this.config.withCredentials });
  }

  private buildQueryString() {
    let keyValuePairs: string[][] = [];
    let urlParams = [ 'defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams' ];

    urlParams.forEach((params) => {
      if (this.defaults[ params ]) {
        (<string[]>this.defaults[ params ]).forEach((paramName) => {
          let camelizedName = camelCase(paramName);
          let paramValue = typeof this.defaults[ paramName ] === 'function' ?
            this.defaults[ paramName ]() :
            this.defaults[ camelizedName ];

          if (paramName === 'state') {
            let stateName = this.defaults.name + '_state';
            paramValue = encodeURIComponent(this.storage.get(stateName));
          }

          if (paramName === 'scope' && Array.isArray(paramValue)) {
            paramValue = paramValue.join(this.defaults.scopeDelimiter);

            if (this.defaults.scopePrefix) {
              paramValue = [ this.defaults.scopePrefix, paramValue ].join(this.defaults.scopeDelimiter);
            }
          }

          keyValuePairs.push([ paramName, paramValue ]);
        });
      }
    });

    return keyValuePairs.map(function (pair) {
      return pair.join('=');
    }).join('&');
  }
}
