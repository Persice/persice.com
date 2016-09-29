import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { HeaderState } from '../../../header';
import { AppStateService } from '../../../../shared/services';

@Component({
  selector: 'prs-mobile-choose-album',
  templateUrl: './choose-album.html'
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
