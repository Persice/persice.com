export class ScrollableList {

  private _title: string;
  private _itemTotalCount: string;
  private _items: any[];
  private _loading: boolean;
  private _nextUrl: string;


  constructor() {
    this._items = [];
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get itemTotalCount(): string {
    return this._itemTotalCount;
  }

  set itemTotalCount(value: string) {
    this._itemTotalCount = value;
  }

  get items(): any[] {
    return this._items;
  }

  set items(value: any[]) {
    this._items = value;
  }

  get loading(): boolean {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = value;
  }

  get nextUrl(): string {
    return this._nextUrl;
  }

  set nextUrl(value: string) {
    this._nextUrl = value;
  }
}
