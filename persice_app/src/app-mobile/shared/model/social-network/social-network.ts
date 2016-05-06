export abstract class SocialNetwork {
  private _name;
  private _url;

  get name() {
    return this._name;
  }

  get url() {
    return this._url;
  }

  set name(value) {
    this._name = value;
  }

  set url(value) {
    this._url = value;
  }
}
