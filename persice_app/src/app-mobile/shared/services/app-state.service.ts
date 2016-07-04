import {Injectable, EventEmitter, provide} from '@angular/core';

@Injectable()
export class AppStateService {

  headerStateEmitter: EventEmitter<any> = new EventEmitter();
  isHeaderVisibleEmitter: EventEmitter<any> = new EventEmitter();
  goBackToListViewEmitter: EventEmitter<any> = new EventEmitter();
  isFilterVisibleEmitter: EventEmitter<any> = new EventEmitter();
  isProfileFooterVisibleEmitter: EventEmitter<any> = new EventEmitter();
  isUserProfileVisibleEmitter: EventEmitter<any> = new EventEmitter();
  editMyProfileStateEmitter: EventEmitter<any> = new EventEmitter();
  editPhotosStateEmitter: EventEmitter<any> = new EventEmitter();
  sendMessageEmitter: EventEmitter<any> = new EventEmitter();
  backEmitter: EventEmitter<any> = new EventEmitter();

  setHeaderVisibility(visible: boolean) {
    this.isHeaderVisibleEmitter.emit(visible);
  }

  setUserProfileVisibility(visible: boolean) {
    this.isUserProfileVisibleEmitter.emit(visible);
  }

  setFilterVisibility(visible: boolean) {
    this.isFilterVisibleEmitter.emit(visible);
  }

  setProfileFooterVisibility(state: any) {
    this.isProfileFooterVisibleEmitter.emit(state);
  }

  setEditMyProfileState(state: any) {
    this.editMyProfileStateEmitter.emit(state);
  }

  setEditPhotosState(state: any) {
    this.editPhotosStateEmitter.emit(state);
  }

}
export var appsTateServiceInjectables: Array<any> = [
  provide(AppStateService, { useClass: AppStateService })
];
