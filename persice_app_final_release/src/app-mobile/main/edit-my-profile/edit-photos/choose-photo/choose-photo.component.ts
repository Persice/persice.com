import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HeaderState } from '../../../header';
import { AppStateService } from '../../../../shared/services';

@Component({
  selector: 'prs-mobile-choose-photo',
  templateUrl: './choose-photo.html',
})
export class ChoosePhotoComponent implements OnInit {

  @Input() photos: any[] = [];
  @Input() loading: boolean;
  @Output() onLoadMoreFBPhotos: EventEmitter<any> = new EventEmitter();

  constructor(
    private appStateService: AppStateService,
    private headerState: HeaderState
  ) { }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backWithTitle('choose photo', HeaderState.actions.ChooseAlbum)
    );
  }

  public openCropPhoto(selectedPhoto: any) {
    this.appStateService.setEditPhotosState({ page: 4, refreshPhotos: false, photo: selectedPhoto });
  }

}
