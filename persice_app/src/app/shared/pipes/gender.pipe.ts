import {Pipe, Injectable, PipeTransform} from '@angular/core';
import {Person} from "../../../app-mobile/shared/model/person";

@Injectable()
@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    return Person.parseGender(value);
  }
}
