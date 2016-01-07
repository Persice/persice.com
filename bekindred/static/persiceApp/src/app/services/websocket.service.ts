import {provide, Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';

import * as Rx from 'rxjs';
import * as io from 'socket.io-client';


import {CookieUtil} from '../core/util';

const HOSTNAME = window.location.hostname;

const USER_ID = CookieUtil.getValue('userid');

@Injectable()
export class WebsocketService {

  static API_URL: string = '//' + HOSTNAME + ':3000';
  static _socket: any;

  constructor() {
    WebsocketService._socket = io();
  }

  public connect() {
    WebsocketService._socket.connect(WebsocketService.API_URL);
  }

  public disconnect() {
    WebsocketService._socket.disconnect();
  }


  public on(evt: string): Rx.Subject<any> {
    let subj = new Rx.Subject<any>();
    WebsocketService._socket.on(evt, (res) => {
      subj.next(res);
    });
    return subj;
  }

  public emit(evt: string, data): Rx.Subject<any> {
    let subj = new Rx.Subject<any>();
    WebsocketService._socket.emit(evt, data, (res) => {
      subj.next(res);
    });
    return subj;
  }

}

export let websocketServiceInjectables: Array<any> = [
  provide(WebsocketService, { useClass: WebsocketService })
];
