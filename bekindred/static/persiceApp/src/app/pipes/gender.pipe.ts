/// <reference path="../../typings/_custom.d.ts" />


import {Pipe, Injectable} from 'angular2/angular2';


@Pipe({
    name: 'gender'
})
@Injectable()
export class GenderPipe {
    transform(value: string, args: any[]) {
        if (value === 'f') {
            return 'female';
        } else {
            return 'male';
        }
        return;
    }
}