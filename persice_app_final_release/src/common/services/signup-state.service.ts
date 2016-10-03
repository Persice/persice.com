import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SignupStateService {
  counterEmitter: EventEmitter<any> = new EventEmitter();
}
