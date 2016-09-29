import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnInit } from '@angular/core';
import { HeaderState } from '../../../header';
import { Photo } from '../../../../../common/models/photo';
import { AppStateService } from '../../../../shared/services';

@Component({
  selector: 'prs-mobile-arrange-photos',
  templateUrl: './arrange-photos.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrangePhotosComponent implements OnInit {
  @Input() loading: boolean;

  @Input() set photos(photosList: Photo[]) {
    this._setState(photosList);
  };

  @Input() set photosCount(count: number) {
    this._checkIfProfilePhotoIsDeletable(count);
  };

  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  private profilePhoto: Photo = new Photo({ order: -1 });
  private thumbs: Photo[] = [];
  private isProfilePhotoDeletable: boolean = true;

  constructor(
    private appStateService: AppStateService,
    private headerState: HeaderState
  ) { }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backDoneWithTitle('edit photos', HeaderState.actions.EditMyProfile)
    );
  }

  private _setState(data: Photo[]) {
    this.profilePhoto = data[ 0 ];
    this.thumbs = data.slice(1, 5);
  }

  private _checkIfProfilePhotoIsDeletable(count: number) {
    if (count === 1) {
      this.isProfilePhotoDeletable = false;
    } else {
      this.isProfilePhotoDeletable = true;
    }
  }

}
