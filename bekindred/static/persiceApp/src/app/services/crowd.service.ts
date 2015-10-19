/// <reference path="../../typings/_custom.d.ts" />

import {provide, Inject, Injectable} from 'angular2/angular2';


@Injectable()
export class CrowdService {

}

export var crowdServiceInjectables: Array<any> = [
  provide(CrowdService, { useClass: CrowdService })
];
