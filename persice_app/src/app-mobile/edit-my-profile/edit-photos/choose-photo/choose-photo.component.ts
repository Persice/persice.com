import {Component, OnInit} from '@angular/core';

import {AppStateService} from '../../../shared/services/app-state.service';

@Component({
  selector: 'prs-mobile-choose-photo',
  template: require('./choose-photo.html')
})
export class ChoosePhotoComponent implements OnInit {

  public photos: any[] = [];

  constructor(
    private appStateService: AppStateService
  ) { }

  ngOnInit(): any {
    this.appStateService.setEditMyProfileState({ title: 'choose photo', isDoneButtonVisible: false });
  }

  openCropPhoto(event) {
    this.appStateService.setEditPhotosState({page: 4, refreshPhotos: false});
  }

}
