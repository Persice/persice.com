import { provide, Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

import {InterfaceNotification, NotificationModel} from '../models/notification.model';
import {remove, find} from 'lodash';


@Injectable()
export class NotificationService {
  observers: any[] = [];
  notifications: NotificationModel[] = [];

  push(content: InterfaceNotification): void {
    let notification = new NotificationModel(
      content.type,
      content.title,
      content.body,
      content.autoclose
    );

    this.notifications.push(notification);

    for (var i = this.observers.length - 1; i >= 0; i--) {
      let subject = this.observers[i].subject;
      subject.next(notification);
    }
  }

  addObserver(name): void {
    let obs = { name: '', subject: null };
    obs.name = name;
    obs.subject = new Subject(null);
    this.observers.push(obs);
  };

  removeObserver(name): void {
    remove(this.observers, (o) => {
      return o.name === name;
    });
  }

  observer(name): Subject<any> {
    let obs = find(this.observers, (o) => {
      return o.name === name;
    });
    return obs.subject;
  }

  hasObserver(name): boolean {
    let obs = find(this.observers, (o) => {
      return o.name === name;
    });

    if (obs) {
      return true;
    } else {
      return false;
    }
  }

}
export var notificationServiceInjectables: Array<any> = [
  provide(NotificationService, { useClass: NotificationService })
];