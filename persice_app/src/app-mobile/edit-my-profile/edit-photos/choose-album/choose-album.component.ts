import {Component, OnInit} from '@angular/core';

import {AppStateService} from '../../../shared/services/app-state.service';

@Component({
  selector: 'prs-mobile-choose-album',
  template: require('./choose-album.html')
})
export class ChooseAlbumComponent implements OnInit {

  public albums: any[] = [];

  constructor(
    private appStateService: AppStateService
  ) { }

  ngOnInit(): any {
    this.appStateService.setEditMyProfileState({ title: 'choose album', isDoneButtonVisible: false });
  }

  openChoosePhoto(event) {
    this.appStateService.setEditPhotosState({ page: 3, refreshPhotos: false });
  }

}
