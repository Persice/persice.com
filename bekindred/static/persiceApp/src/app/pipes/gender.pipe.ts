/// <reference path="../../typings/_custom.d.ts" />

import {Pipe, Injectable} from 'angular2/angular2';

@Pipe({
  name: 'gender'
})
@Injectable()
export class GenderPipe {
  transform(value: string, args: any[]): string {
    let retValue = '';
    switch (value) {
      case 'm':
        retValue = 'male';
        break;
      case 'f':
        retValue = 'female';
        break;
      default:
        retValue = '';
        break;
    }


    return retValue;
  }
}
