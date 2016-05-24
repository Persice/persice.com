import {Component, OnInit} from '@angular/core';

import {AppStateService} from '../../../shared/services/app-state.service';

@Component({
  selector: 'prs-mobile-crop-photo',
  template: require('./crop-photo.html')
})
export class CropPhotoComponent implements OnInit {

  public photo: any[] = [];

  constructor(
    private appStateService: AppStateService
  ) { }

  ngOnInit(): any {
    this.appStateService.setEditMyProfileState({
      title: 'crop photo',
      isDoneButtonVisible: false,
      isCroppingPhotosDoneButtonVisible: true
    });
  }

  private _getPhoto() {

  }

}
