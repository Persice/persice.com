import {Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnInit} from '@angular/core';

import {EditPhotoThumbComponent} from './edit-photo-thumb';
import {EditProfilePhotoComponent} from './edit-profile-photo';
import {LoadingComponent} from '../../../../app/shared/components/loading';
import {Photo} from '../../../../common/models/photo';
import {AppStateService} from '../../../shared/services/app-state.service';
import {HeaderActions, LeftHeaderState, RightHeaderState, CenterHeaderState} from '../../../header';

@Component({
  selector: 'prs-mobile-arrange-photos',
  template: require('./arrange-photos.html'),
  directives: [EditPhotoThumbComponent, EditProfilePhotoComponent, LoadingComponent],
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

  constructor(private appStateService: AppStateService) { }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit({
      left: LeftHeaderState.Back,
      leftAction: HeaderActions.EditMyProfile,
      center: CenterHeaderState.Title,
      right: RightHeaderState.Done,
      rightAction: HeaderActions.EditMyProfile,
      transparent: false,
      title: 'Edit Photos'
    });
  }

  private _setState(data: Photo[]) {
    this.profilePhoto = data[0];
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
