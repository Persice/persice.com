export class SocialProfile {
  private _name: string;
  private _type: string;
  private _image: string;
  private _url: string;
  private _connected: boolean;

  constructor(dto: any) {
    this._type = dto.type;
    this._connected = dto.connected;
    switch (dto.type) {
      case 'facebook':
        this._name = dto.first_name;
        this._image = `//graph.facebook.com/${dto.facebook_id}/picture?type=square`;
        this._url = `https://www.facebook.com/app_scoped_user_id/${dto.facebook_id}`;
        break;
      case 'twitter':
        this._name = dto.name;
        this._image = !!dto.profile_image_url ? dto.profile_image_url : '';
        this._url = !!dto.screen_name ? `https://twitter.com/${dto.screen_name}` : '';
        break;
      case 'linkedin':
        this._name = dto.firstName;
        this._image = !!dto.pictureUrls.values[0] ? dto.pictureUrls.values[0] : '';
        this._url = !!dto.public_profile_url ? dto.public_profile_url : '';
        break;
      default:
        break;
    }
  }

  get name(): string {
    return this._name;
  }

  get connected(): boolean {
    return this._connected;
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
