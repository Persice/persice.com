import {Component, Input, EventEmitter, Output, OnInit} from '@angular/core';

import {LoadingComponent} from '../../../../app/shared/components/loading';
import {AppStateService} from '../../../shared/services/app-state.service';
import {InfiniteScrollDirective} from '../../../../common/directives';
import {HeaderActions, LeftHeaderState, RightHeaderState, CenterHeaderState} from '../../../header';

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
    this.appStateService.headerStateEmitter.emit({
      left: LeftHeaderState.Back,
      leftAction: HeaderActions.EditPhotos,
      center: CenterHeaderState.Title,
      right: RightHeaderState.None,
      transparent: false,
      title: 'Choose Album'
    });
  }

  public openChoosePhoto(id: number): void {
    this.appStateService.setEditPhotosState({ page: 3, refreshPhotos: false, albumId: id });
  }

}
