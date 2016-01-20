import { provide, Injectable, EventEmitter } from 'angular2/core';


@Injectable()
export class WarningService {
  event: EventEmitter<any> = new EventEmitter;

  push(content: any): void {
     this.event.next(content);
   }


  observer(): EventEmitter<any> {
    return this.event;
  }


}
export var warningServiceInjectables: Array<any> = [
  provide(WarningService, { useClass: WarningService })
];
