import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Photo } from '../../../../../../common/models/photo';
import { AppStateService } from '../../../../../shared/services';

@Component({
  selector: 'prs-mobile-edit-profile-photo',
  templateUrl: './edit-profile-photo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProfilePhotoComponent {
  @Input() photo: Photo;
  @Input() isDeletionEnabled: boolean;
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  constructor(private appStateService: AppStateService) { }

  openChooseAlbum(event) {
    this.appStateService.setEditPhotosState({ page: 2 });
  }
}