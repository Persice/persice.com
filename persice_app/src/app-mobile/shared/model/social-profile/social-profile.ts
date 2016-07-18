export class SocialProfile {
  private _name: string;
  private _type: string;
  private _image: string;
  private _url: string;
  private _mutual: boolean;

  constructor(dto: any) {
    this._type = dto.user_type;
    this._mutual = dto.mutual;
    switch (this.type) {
      case 'facebook':
        this._name = dto.first_name;
        this._image = `//graph.facebook.com/${dto.facebook_id}/picture?type=square`;
        this._url = `https://www.facebook.com/app_scoped_user_id/${dto.facebook_id}`;
        break;
      case 'twitter':
        this._name = dto.first_name;
        this._image = !!dto.image ? dto.image : '';
        this._url = !!dto.username ? `https://twitter.com/${dto.username}` : '';
        break;
      case 'linkedin':
        this._name = dto.first_name;
        this._image = !!dto.image ? dto.image : '';
        this._url = !!dto.linkedin_provider ? dto.linkedin_provider : '';
        break;
      default:
        break;
    }
  }

  get name(): string {
    return this._name;
  }

  get mutual(): boolean {
    return this._mutual;
  }

  get image(): string {
    return this._image;
  }

  get url(): string {
    return this._url;
  }

  get type(): string {
    return this._type;
  }

}
