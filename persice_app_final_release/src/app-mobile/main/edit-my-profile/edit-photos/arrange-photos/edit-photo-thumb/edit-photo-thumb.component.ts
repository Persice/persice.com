import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Photo } from '../../../../../../common/models/photo';
import { AppStateService } from '../../../../../shared/services';

@Component({
  selector: 'prs-mobile-edit-photo-thumb',
  templateUrl: './edit-photo-thumb.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPhotoThumbComponent {
  @Input() photo: Photo;
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  constructor(private appStateService: AppStateService) { }

  public openChooseAlbum(event) {
    this.appStateService.setEditPhotosState({ page: 2 });
  }

}
