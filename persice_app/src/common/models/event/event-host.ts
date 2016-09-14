import { Gender } from './gender';
export class EventHost {

  private defaultImage: string = '/assets/images/empty_avatar.png';

  private _name: string;
  private _image: string;
  private _username: string;
  private _age: number;
  private _gender: Gender;
  private _description: string;
  private _link: string;

  constructor(dto: any) {
    this._name = dto.name;
    this._image = dto.image || this.defaultImage;
    this._username = dto.username;
    this._age = dto.age;
    this._gender = dto.gender ? new Gender(dto.gender) : null;
    this._description = dto.about_me || '';
    this._link = dto.link;
  }

  get name(): string {
    return this._name;
  }

  get image(): string {
    return this._image;
  }

  get username(): string {
    return this._username;
  }

  get age(): number {
    return this._age;
  }

  get gender(): Gender {
    return this._gender;
  }

  get description(): string {
    return this._description;
  }

  get link(): string {
    return this._link;
  }
}
