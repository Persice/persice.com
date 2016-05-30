interface PhotoInterface {
  order: number;
  id?: number;
  photo?: string;
  cropped_photo?: string;
  resource_uri?: string;
  user?: string;
}

export class Photo {

  private _id: number;
  private _order: number;
  private _photo: string;
  private _croppedPhoto: string;
  private _resourceUri: string;
  private _user: string;

  constructor(dto: PhotoInterface) {
    this._id = dto.id ? dto.id : -1;
    this._photo = dto.photo ? dto.photo : '';
    this._croppedPhoto = dto.cropped_photo ? dto.cropped_photo : '';
    this._order = dto.order;
    this._user = dto.user ? dto.user : '';
    this._resourceUri = dto.resource_uri ? dto.resource_uri : '';
  }

  get id(): number {
    return this._id;
  }

  get order(): number {
    return this._order;
  }

  get photo(): string {
    return this._photo;
  }

  get croppedPhoto(): string {
    return this._croppedPhoto;
  }

  get resourceUri(): string {
    return this._resourceUri;
  }

  get user(): string {
    return this._user;
  }

  public toDto(): any {
    return {
      id: this.id,
      order: this.order,
      photo: this.photo,
      cropped_photo: this.croppedPhoto,
      resource_uri: this.resourceUri,
      user: this.user,
    };
  }
}
