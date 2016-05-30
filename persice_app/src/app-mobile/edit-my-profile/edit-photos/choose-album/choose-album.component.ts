import {Component, Input, EventEmitter, Output, OnInit} from '@angular/core';

import {LoadingComponent} from '../../../../app/shared/components/loading';
import {AppStateService} from '../../../shared/services/app-state.service';
import {InfiniteScrollDirective} from '../../../../common/directives';

@Component({
  selector: 'prs-mobile-choose-album',
  template: require('./choose-album.html'),
  directives: [LoadingComponent, InfiniteScrollDirective]
})
export class ChooseAlbumComponent implements OnInit {

  @Input() albums: any[] = [];
  @Input() loading: boolean;
  @Output() onLoadMoreFBAlbums: EventEmitter<any> = new EventEmitter();

  constructor(private appStateService: AppStateService) { }

  ngOnInit(): any {
    this.appStateService.setEditMyProfileState({
      title: 'choose album',
      isDoneButtonVisible: false
    });
  }

  public openChoosePhoto(id: number): void {
    this.appStateService.setEditPhotosState({ page: 3, refreshPhotos: false, albumId: id });
  }

}
