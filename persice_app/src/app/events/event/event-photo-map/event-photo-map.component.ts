import { Component, Input } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { NotificationService } from '../../../shared/services';
import { CheckImageDirective } from '../../../shared/directives';
import { FileUtil } from '../../../../common/core';
import { GOOGLE_MAPS_DIRECTIVES } from '../../../../common/google-map/directives';
import { LoadingComponent } from '../../../shared/components/loading';
import { Event } from '../../../../common/models/event/index';
import { EventService } from '../../../../common/events/event.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'prs-event-photo-map',
  template: <any>require('./event-photo-map.html'),
  directives: [
    GOOGLE_MAPS_DIRECTIVES,
    CORE_DIRECTIVES,
    CheckImageDirective,
    LoadingComponent
  ]
})
export class EventPhotoMapComponent {
  @Input() event: Event;

  private showMap: boolean = false;
  private showPhoto: boolean = true;
  private zoom: number = 8;
  private isImageUploading$: Observable<boolean>;

  constructor(
    private eventService: EventService,
    private notificationService: NotificationService
  ) {
    this.isImageUploading$ = this.eventService.isImageUploading$;
  }

  private openFileDialog() {
    document.getElementById('inputfile').click();
  }

  private changeListener($event): void {
    this.readThis($event.target);
  }

  private readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let photo = {
      event_photo: file
    };

    if (file !== undefined) {
      if (FileUtil.isImage(photo.event_photo.type)) {
        this.eventService.updateImageByUri(photo, this.event.resourceUri);
      } else {
        this.notificationService.push({
          type: 'error',
          title: 'Error',
          body: 'Selected file is not a valid image.',
          autoclose: 4000
        });
      }
    }
  }

  private setShowMap(): void {
    this.showMap = true;
    this.showPhoto = false;
  }

  private setShowPhoto(): void {
    this.showMap = false;
    this.showPhoto = true;
  }
}
