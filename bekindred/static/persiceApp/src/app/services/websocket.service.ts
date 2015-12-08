/// <reference path="../../typings/_custom.d.ts" />

import {provide, Injectable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';


import * as io from 'socket.io-client';

const HOSTNAME = window.location.hostname;

@Injectable()
export class WebsocketService {

  static API_URL: string = '//' + HOSTNAME + ':3000';
  static _socket: any = io();

  constructor() {

    console.log('creating socket object');

    WebsocketService._socket = io();
    console.log('establishing connection to server... %s', WebsocketService.API_URL);
    WebsocketService._socket.connect(WebsocketService.API_URL);

  }

  // public on(eventName: string): Observable<any> {

    // return Observable.create(observer => {
    //   WebsocketService._socket.on(eventName, (ev, data) => {
    //     observer.next(data);
    //     observer.complete();
    //   });

    // });


  // }

  // public emit(eventName, data, callback): void {
  //   WebsocketService._socket.emit(eventName, data, function() {
  //     let args = arguments;
  //     if (typeof callback === 'function') {
  //       callback.apply(this.socket, args);

  //     }
  //   });
  // }



}

export let websocketServiceInjectables: Array<any> = [
  provide(WebsocketService, { useClass: WebsocketService })
];

