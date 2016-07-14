import { provide, Injectable } from '@angular/core';


@Injectable()
export class HistoryService {
  _routes: string[] = ['', '', '', '', ''];
  _index = -1;

  constructor() {

  }

  setRoute(route) {
    this._index = this._index + 1;
    if (this._index > 4) {
      this._index = 0;
    }
    this._routes[this._index] = route;

  }

  getPrev() {

    let prevIndex = this._index - 1;
    if (prevIndex < 0) {
      prevIndex = this._routes.length - 1;
    }
    return this._routes[prevIndex];
  }

  getAll() {
    console.log('all routes history', this._routes);
    console.log('index', this._index);
    return this._routes;
  }

}

export var historyServiceInjectables: Array<any> = [
  provide(HistoryService, {useClass: HistoryService})
];
