/// <reference path="../../typings/_custom.d.ts" />

import {bind, Inject, Injectable} from 'angular2/angular2';


@Injectable()
export class UserService {

}

export var userServiceInjectables: Array<any> = [
    bind(UserService).toClass(UserService)
];

