import {provide, Injectable} from 'angular2/angular2';
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
    // console.log('creating socket object');
    WebsocketService._socket = io();
  }

  public connect() {
    // console.log('establishing websocket connection to server... %s', WebsocketService.API_URL);
    WebsocketService._socket.connect(WebsocketService.API_URL);
  }

  public disconnect() {
    // console.log('disconnecting websocket connection from server... %s', WebsocketService.API_URL);
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

