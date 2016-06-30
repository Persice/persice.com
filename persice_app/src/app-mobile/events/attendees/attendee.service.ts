import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Person} from '../../shared/model/person';
import {PersonGenerator} from '../../shared/model/person-generator';

@Injectable()
export class AttendeeService {

  public getGoing(): Observable<Person[]> {
    let result: Person[]  = [];

    result = [...result, PersonGenerator.givenAnyPerson(), PersonGenerator.givenAnyPerson()];

    return Observable.of(result);
  }

  public getMaybe(): Observable<Person[]> {
    let result: Person[]  = [];

    result = [...result,
      PersonGenerator.givenAnyPerson(), PersonGenerator.givenAnyPerson(), PersonGenerator.givenAnyPerson()];

    return Observable.of(result);
  }

  public getNotGoing(): Observable<Person[]> {
    let result: Person[]  = [];

    result = [...result, PersonGenerator.givenAnyPerson()];

    return Observable.of(result);
  }
}
