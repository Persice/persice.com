import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { Gender } from '../models/event/gender';

@Injectable()
@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    return Gender.parseGender(value);
  }
}
