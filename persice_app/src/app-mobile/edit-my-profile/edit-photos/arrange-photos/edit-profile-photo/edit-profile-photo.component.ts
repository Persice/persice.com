import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {Photo} from '../../../../../common/models/photo';
import {AppStateService} from '../../../../shared/services';
import {CheckImageDirective} from '../../../../../app/shared/directives';

@Component({
  selector: 'prs-mobile-edit-profile-photo',
  template: require('./edit-profile-photo.html'),
  directives: [CheckImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProfilePhotoComponent {
  @Input() photo: Photo;
  @Input() isDeletionEnabled: boolean;
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  constructor(private appStateService: AppStateService) { }

  openChooseAlbum(event) {
    this.appStateService.setEditPhotosState({ page: 2, refreshPhotos: false });
  }
}
