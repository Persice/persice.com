export class Album {

  private _id: string;
  private _image: string;
  private _name: string;
  private _count: number;

  public static getCollection(dtoArray: any): Album[] {
    let items: Album[] = [];
    for (var i = 0; i < dtoArray.length; ++i) {
      let item = new Album(dtoArray[ i ]);
      items = [ ...items, item ];
    }
    return items;
  }

  constructor(dto: any) {
    this._id = dto.id;
    this._image = dto.image;
    this._name = dto.name;
    this._count = dto.count;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get image(): string {
    return this._image;
  }

  get count(): number {
    return this._count;
  }

}
