export class EventHost {

  private defaultImage: string = '/assets/images/empty_avatar.png';

  private _name: string;
  private _image: string;
  private _username: string;
  private _age: number;
  private _gender: string;
  private _distance: string;
  private _description: string;

  constructor(dbo: any) {
    this._name = dbo.first_name;
    this._image = dbo.image || this.defaultImage;
    this._username = dbo.username;
    this._age = dbo.age;
    this._gender = dbo.gender;
    this._distance = dbo.distance == null ? '' : dbo.distance[0];
    this._description = dbo.about_me;
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

  get gender(): string {
    return this._gender;
  }

  get distance(): string {
    return this._distance;
  }

  get description(): string {
    return this._description;
  }
}
