import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { EventService, NotificationService } from '../../shared/services';
import { CheckImageDirective } from '../../shared/directives';
import { FileUtil } from '../../shared/core';
import { GOOGLE_MAPS_DIRECTIVES } from '../../../common/google-map/directives';
import { LoadingComponent } from '../../shared/components/loading';

// just an interface for type safety.
interface IMarker {
  lat: number;
  lng: number;
  label?: string;
}

@Component({
  selector: 'prs-event-photo-map',
  template: <any>require('./event-photo-map.html'),
  directives: [
    GOOGLE_MAPS_DIRECTIVES,
    CORE_DIRECTIVES,
    CheckImageDirective,
    LoadingComponent
  ],
  providers: [EventService]
})
export class EventPhotoMapComponent implements OnChanges {
  @Input() location;
  @Input() photo;
  @Input() stats;
  @Input() host;
  @Input() uri;
  @Output() refreshEvent: EventEmitter<any> = new EventEmitter();

  showMap: boolean = false;
  showPhoto: boolean = true;

  // google maps zoom level
  zoom: number = 8;

  // initial center position for the map
  lat: number;
  lng: number;

  markers: IMarker[] = [];

  isPhotoLoading: boolean = false;

  constructor(
    private service: EventService,
    private notificationService: NotificationService
  ) {

  }

  ngOnChanges(values) {
    // check if location exists
    if (values.location && values.location.currentValue) {

      if (Object.keys(values.location.currentValue).length > 0) {
        this.markers = [
          {
            lat: parseFloat(values.location.currentValue.latitude),
            lng: parseFloat(values.location.currentValue.longitude),
            label: values.location.currentValue.name
          }
        ];

        this.lat = parseFloat(values.location.currentValue.latitude);
        this.lng = parseFloat(values.location.currentValue.longitude);
        this.zoom = 12;
      }
    }
  }

  openFileDialog(event) {
    document.getElementById('inputfile').click();
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let event = {
      event_photo: file
    };

    if (file !== undefined) {
      if (FileUtil.isImage(event.event_photo.type)) {
        this.isPhotoLoading = true;
        this.service.updateImageByUri(event, this.uri).subscribe((res) => {
          this.refreshEvent.emit(true);
          this.isPhotoLoading = false;
        }, (err) => {
          this.isPhotoLoading = false;
          console.log(err);
        }, () => {
        });
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

}
