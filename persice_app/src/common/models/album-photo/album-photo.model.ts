export class AlbumPhoto {

  private _id: string;
  private _picture: string;
  private _largePicture: string;
  private _name: string;
  private _count: number;

  public static getCollection(dtoArray: any): AlbumPhoto[] {
    let items: AlbumPhoto[] = [];
    for (var i = 0; i < dtoArray.length; ++i) {
      let item = new AlbumPhoto(dtoArray[i]);
      items = [...items, item];
    }
    return items;
  }

  constructor(dto: any) {
    this._id = dto.id;
    this._picture = dto.picture;
    this._largePicture = dto.images[2];
    this._name = dto.name;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get picture(): string {
    return this._picture;
  }

  get largePicture(): string {
    return this._largePicture;
  }

  get count(): number {
    return this._count;
  }

}
