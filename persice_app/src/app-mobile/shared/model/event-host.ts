export class EventHost {

  private defaultImage = '/assets/images/empty_avatar.png';

  private _name: string;
  private _image: string;

  constructor(name: string, image: string) {
    this._name = name;
    this._image = image || this.defaultImage;
  }

  get name() {
    return this._name;
  }

  get image() {
    return this._image;
  }
}
