import {Component, Input, EventEmitter, Output, OnInit} from '@angular/core';

import {LoadingComponent} from '../../../../app/shared/components/loading';
import {AppStateService} from '../../../shared/services/app-state.service';
import {InfiniteScrollDirective} from '../../../../common/directives';
import {HeaderState} from '../../../header';

@Component({
  selector: 'prs-mobile-choose-album',
  template: <any>require('./choose-album.html'),
  directives: [LoadingComponent, InfiniteScrollDirective]
})
export class ChooseAlbumComponent implements OnInit {

  @Input() albums: any[] = [];
  @Input() loading: boolean;
  @Output() onLoadMoreFBAlbums: EventEmitter<any> = new EventEmitter();

  constructor(
    private appStateService: AppStateService,
    private headerState: HeaderState
    ) { }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backWithTitle('choose album', HeaderState.actions.EditPhotos)
    );
  }

  public openChoosePhoto(id: number): void {
    this.appStateService.setEditPhotosState({ page: 3, refreshPhotos: false, albumId: id });
  }

}
