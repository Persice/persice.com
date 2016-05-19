export abstract class SocialNetwork {
  private _name: string;
  private _id: string;
  private _url: string;

  get name(): string {
    return this._name;
  }

  get id(): string {
    return this._id;
  }

  get url(): string {
    return this._url;
  }

  set name(value: string) {
    this._name = value;
  }

  set id(value: string) {
    this._id = value;
  }

  set url(value: string) {
    this._url = value;
  }
}
