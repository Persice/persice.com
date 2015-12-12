import {Pipe, Injectable} from 'angular2/angular2';

@Injectable()
@Pipe({
  name: 'gender'
})
export class GenderPipe {
  transform(value: string, args: any[]): string {
    let retValue: string = '';
    switch (value) {
      case 'm':
        retValue = 'male';
        break;
      case 'f':
        retValue = 'female';
        break;
      default:
        retValue = value;
        break;
    }
    return retValue;
  }
}
