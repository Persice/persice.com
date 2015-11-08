/// <reference path="../../typings/_custom.d.ts" />

import {provide, Inject, Injectable, EventEmitter} from 'angular2/angular2';
import * as Rx from '@reactivex/rxjs';

import {remove, find} from 'lodash';


@Injectable()
export class NotificationService {
  observers: any[] = [];


  constructor(

    ) {

  }

  push(content) {
    for (var i = this.observers.length - 1; i >= 0; i--) {
      let name = this.observers[i].name;
      let subject = this.observers[i].subject;
      subject.next(content);
    }
  }

  addObserver(name) {
    let obs = { name: '', subject: null };
    obs.name = name;
    obs.subject = new Rx.Subject(null);
    this.observers.push(obs);
  };

  removeObserver(name) {
    remove(this.observers, (o) => {
      return o.name === name;
    });
  }

  observer(name) {
    let obs = find(this.observers, (o) => {
      return o.name === name;
    });
    return obs.subject;
  }

}
export var notificationServiceInjectables: Array<any> = [
provide(NotificationService, { useClass: NotificationService })
];
