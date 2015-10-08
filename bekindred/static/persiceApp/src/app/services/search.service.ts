/// <reference path="../../typings/_custom.d.ts" />

import {bind, Inject, Injectable} from 'angular2/angular2';


@Injectable()
export class SearchService {

}

export var searchServiceInjectables: Array<any> = [
    bind(SearchService).toClass(SearchService)
];
