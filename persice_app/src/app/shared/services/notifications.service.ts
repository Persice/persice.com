import {Injectable, provide, EventEmitter} from '@angular/core';


@Injectable()
export class NotificationsService {
  private _emitter: EventEmitter<any> = new EventEmitter;


  set(notification: any, flag: boolean) {
    this._emitter.emit({ notification: notification, add: flag });
  };

  getChangeEmitter() {
    return this._emitter;
  }

  removeAll() {
    this._emitter.emit('clean');
  }

}


export var notificationsServiceInjectables: any[] = [
  provide(NotificationsService, { useClass: NotificationsService })
];
