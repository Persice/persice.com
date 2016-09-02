import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SignupStateService {
  counterEmitter: EventEmitter<any> = new EventEmitter();
}
export var signupStateServiceInjectables: Array<any> = [
  {provide: SignupStateService, useClass: SignupStateService}
];
