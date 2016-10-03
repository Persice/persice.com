import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class WebsocketService {

  static _socket: any;

  private token: string;

  constructor(private auth: AuthService) {
    this.token = auth.getToken();
  }

  public connect() {
    WebsocketService._socket = io('/', {
      query: 'token=' + this.token
    });
    WebsocketService._socket.connect();

    WebsocketService._socket.on('unauthorized', (error) => {
      console.log('Websocket is not authorized: ', error);

      if (error.data.type == 'UnauthorizedError' || error.data.code == 'invalid_token') {
        // redirect user to login page perhaps?
        console.log('User\'s token has expired');
      }

    });
  }

  public disconnect() {
    WebsocketService._socket.disconnect();
  }

  public on(evt: string): Subject<any> {
    let subj = new Subject<any>();
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
