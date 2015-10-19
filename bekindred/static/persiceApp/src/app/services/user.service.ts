/// <reference path="../../typings/_custom.d.ts" />

import {provide, Inject, Injectable} from 'angular2/angular2';


@Injectable()
export class UserService {

}

export var userServiceInjectables: Array<any> = [
  provide(UserService, { useClass: UserService })
];

