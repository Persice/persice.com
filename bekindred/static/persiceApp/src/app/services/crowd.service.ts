/// <reference path="../../typings/_custom.d.ts" />

import {bind, Inject, Injectable} from 'angular2/angular2';


@Injectable()
export class CrowdService {

}

export var crowdServiceInjectables: Array<any> = [
    bind(CrowdService).toClass(CrowdService)
];
