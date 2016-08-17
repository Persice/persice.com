import { provide, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';

const HOSTNAME: string = window.location.hostname;

@Injectable()
export class WebsocketService {

  static API_URL: string = '//' + HOSTNAME;
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


  public on(evt: string): Subject<any> {
    let subj = new Subject<any>();
    subj.next('pero');
    WebsocketService._socket.on(evt, (res) => {
      subj.next(res);
    });
    return subj;
  }

  public emit(evt: string, data): Subject<any> {
    let subj = new Subject<any>();
    WebsocketService._socket.emit(evt, data, (res) => {
      subj.next(res);
    });
    return subj;
  }

}

export let websocketServiceInjectables: Array<any> = [
  provide(WebsocketService, {useClass: WebsocketService})
];
