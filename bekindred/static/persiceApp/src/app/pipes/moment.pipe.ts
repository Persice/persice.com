/// <reference path="../../typings/_custom.d.ts" />

import {Pipe, Injectable} from 'angular2/angular2';

declare var jstz: any;

const moment = require('moment');
const momentTz = require('moment-timezone/builds/moment-timezone-with-data.min');

@Injectable()
@Pipe({
  name: 'moment',
  pure: false
})
export class MomentPipe {

  transform(value: Date, args?: any[]): any {
    let momentInstance = moment.utc(value);
    let format = args[0];
    let tz = jstz.determine();
    let tzName = tz.name();

    return momentInstance.tz(tzName).format(format);
  }

}
