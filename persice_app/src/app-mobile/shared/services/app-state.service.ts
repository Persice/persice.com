import {Injectable, EventEmitter, provide} from 'angular2/core';

@Injectable()
export class AppStateService {
  isHeaderVisibleEmitter: EventEmitter<any> = new EventEmitter();
  isFilterVisibleEmitter: EventEmitter<any> = new EventEmitter();
  isProfileFooterVisibleEmitter: EventEmitter<any> = new EventEmitter();

  setHeaderVisibility(visible: boolean) {
    this.isHeaderVisibleEmitter.emit(visible);
  }

  setFilterVisibility(visible: boolean) {
    this.isFilterVisibleEmitter.emit(visible);
  }

  setProfileFooterVisibility(state: any) {
    this.isProfileFooterVisibleEmitter.emit(state);
  }

}
export var appsTateServiceInjectables: Array<any> = [
  provide(AppStateService, { useClass: AppStateService })
];
