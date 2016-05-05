import {ObjectUtil} from "../../../app/shared/core/util";
export class Person {

  public topInterestsFirstHalf: any[];
  public topInterestsSecondHalf: any[];

  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _gender: string;
  private _age: number;
  private _distance: number;
  private _distanceUnit: string;
  private _topInterests: any[];
  private _image: string;
  private _score: number;

  constructor(dto: any) {
    this._id = dto.id;
    this._firstName = dto.first_name;
    this._lastName = dto.last_name;
    this._gender = Person.parseGender(dto.gender);
    this._age = dto.age;
    this._distance = dto.distance[0];
    this._distanceUnit = dto.distance[1];
    this._image = dto.image;
    this._score = dto.score;

    let interestsFromDto = ObjectUtil.firstSorted(dto.top_interests[0], 6);
    let halfLength = Math.ceil(interestsFromDto.length / 2);

    this._topInterests = ObjectUtil.firstSorted(dto.top_interests[0], 6);
    this.topInterestsFirstHalf = interestsFromDto.splice(0, halfLength);
    this.topInterestsSecondHalf = interestsFromDto;
  }

  get id(): string {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get gender(): string {
    return this._gender;
  }

  get age(): number {
    return this._age;
  }

  get distance(): number {
    return this._distance;
  }

  get distanceUnit(): string {
    return this._distanceUnit;
  }

  get topInterests(): any[] {
    return this._topInterests;
  }

  get image(): string {
    return this._image;
  }

  get score(): number {
    return this._score;
  }

  static parseGender(value: string) {
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
