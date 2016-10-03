import { Injectable, EventEmitter } from '@angular/core';

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

