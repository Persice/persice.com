/// <reference path="../../typings/_custom.d.ts" />

import {provide, Inject, Injectable} from 'angular2/angular2';


@Injectable()
export class FilterService {

}

export var filterServiceInjectables: Array<any> = [
  provide(FilterService, { useClass: FilterService })
];
