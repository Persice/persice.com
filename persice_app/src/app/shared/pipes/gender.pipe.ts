import {Pipe, Injectable, PipeTransform} from 'angular2/core';

@Injectable()
@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    let retValue: string = '';
    switch (value) {
      case 'm':
        retValue = 'Male';
        break;
      case 'f':
        retValue = 'Female';
        break;
      default:
        retValue = '';
        break;
    }
    return retValue;
  }
}
