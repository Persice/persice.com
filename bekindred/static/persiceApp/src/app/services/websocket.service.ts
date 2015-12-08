/// <reference path="../../typings/_custom.d.ts" />

import {provide, Injectable, Observable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';

const HOSTNAME = window.location.hostname;

@Injectable()
export class WebsocketService {

  static API_URL: string = '//' + HOSTNAME + '3000';
  constructor() {
  }

  // public get(): Observable<any> {


  // }



}

export var websocketServiceInjectables: Array<any> = [
  provide(WebsocketService, { useClass: WebsocketService })
];

