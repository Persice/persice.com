import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { assign } from './utils';
import { ConfigService, IPopupOptions } from './config.service';

@Injectable()
export class PopupService {
  url = '';
  popupWindow: Window = null;

  private static prepareOptions(options: IPopupOptions) {
    options = options || {};
    let width = options.width || 500;
    let height = options.height || 500;
    return assign(
      {
        width: width,
        height: height,
        left: window.screenX + ((window.outerWidth - width) / 2),
        top: window.screenY + ((window.outerHeight - height) / 2.5)
      },
      options);
  }

  private static stringifyOptions(options: Object) {
    return Object.keys(options).map((key) => {
      return key + '=' + options[ key ];
    }).join(',');
  }

  private static parseQueryString(joinedKeyValue: string): any {
    let key, value;
    return joinedKeyValue.split('&').reduce(
      (obj, keyValue) => {
        if (keyValue) {
          value = keyValue.split('=');
          key = decodeURIComponent(value[ 0 ]);
          obj[ key ] = typeof value[ 1 ] !== 'undefined' ? decodeURIComponent(value[ 1 ]) : true;
        }
        return obj;
      },
      {});
  }

  constructor(private config: ConfigService) {}

  open(url: string, name: string, options: IPopupOptions) {
    this.url = url;

    let stringifiedOptions = PopupService.stringifyOptions(PopupService.prepareOptions(options));
    let UA = window.navigator.userAgent;
    let windowName = (this.config.cordova || UA.indexOf('CriOS') > -1) ? '_blank' : name;

    this.popupWindow = window.open(url, windowName, stringifiedOptions);

    window[ 'popup' ] = this.popupWindow;

    if (this.popupWindow && this.popupWindow.focus) {
      this.popupWindow.focus();
    }

    return this;
  }

  eventListener(redirectUri: string) {
    return Observable
      .fromEvent<Event>(this.popupWindow, 'loadstart')
      .concatMap((event: Event & { url: string }) => {
        if (!this.popupWindow || this.popupWindow.closed) {
          return [ 'Popup Window Closed' ];
        }
        if (event.url.indexOf(redirectUri) !== 0) {
          return [];
        }

        let parser = document.createElement('a');
        parser.href = event.url;

        if (parser.search || parser.hash) {
          const queryParams = parser.search.substring(1).replace(/\/$/, '');
          const hashParams = parser.hash.substring(1).replace(/\/$/, '');
          const hash = PopupService.parseQueryString(hashParams);
          const qs = PopupService.parseQueryString(queryParams);
          const allParams = assign({}, qs, hash);

          this.popupWindow.close();

          if (allParams.error) {
            throw allParams.error;
          } else {
            return <any>[ allParams ];
          }
        }
        return [];
      })
      .take(1)
      .takeWhile((response) => response !== 'Popup Window Closed');
  }

  pollPopup() {
    return Observable
      .interval(50)
      .concatMap(() => {
        if (!this.popupWindow || this.popupWindow.closed) {
          return Observable.throw('popup_closed');
        }
        let documentOrigin = document.location.host;
        let popupWindowOrigin = '';
        try {
          popupWindowOrigin = this.popupWindow.location.host;
        } catch (error) {
          // ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
          //error instanceof DOMException && error.name === 'SecurityError'
        }
        if (popupWindowOrigin === documentOrigin && (this.popupWindow.location.search || this.popupWindow.location.hash)) {
          const queryParams = this.popupWindow.location.search.substring(1).replace(/\/$/, '');
          const hashParams = this.popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
          const hash = PopupService.parseQueryString(hashParams);
          const qs = PopupService.parseQueryString(queryParams);
          this.popupWindow.close();
          const allParams = assign({}, qs, hash);
          if (allParams.error) {
            throw allParams.error;
          } else {
            return [ allParams ];
          }
        }
        return [];
      })
      .take(1)
      .takeWhile((response) => response !== 'Popup Window Closed');
  }
}
