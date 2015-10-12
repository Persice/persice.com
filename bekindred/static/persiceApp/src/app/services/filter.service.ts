/// <reference path="../../typings/_custom.d.ts" />

import {bind, Inject, Injectable} from 'angular2/angular2';


@Injectable()
export class FilterService {

}

export var filterServiceInjectables: Array<any> = [
    bind(FilterService).toClass(FilterService)
];
